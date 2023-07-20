import pathlib
import re
import shutil
import uuid
from functools import cache as memoize
from io import BytesIO
from enum import Enum
import PIL.Image
import bbcode
from django.core.files.base import ContentFile
from django.utils.html import escape
from django.core.cache import cache
from django.utils import timezone
from rest_framework.serializers import UUIDField
from rest_framework.views import exception_handler
from djangoconf import settings
import board.models as models

admin_text_code = settings.env.get('ADMIN_TEXT_CODE')


class RoutesCache(Enum):
    board = 3600 * 24
    thread = 3600 * 24
    board_list = 1800

    @classmethod
    def update_cache(cls, cache_key, cache_id):
        """ simply use timestamp as ETag as ETags are per URL """
        timestamp = str(timezone.now().timestamp())
        cache.set(
            key=f'{cache_key}:{cache_id}',
            value=timestamp,
            timeout=cls[cache_key].value
        )
        return timestamp

    @classmethod
    def get_etag(cls, _request, **route_kwargs):
        """ get (or set and get) etag from cache
        if client's request header etag is the same as etag from cache,
        return 304 Not-Modified response without further processing """

        if board := route_kwargs.get('board'):
            board_etag = cache.get(f'{cls.board.name}:{board}')
            if not board_etag:
                board_etag = cls.update_cache(cls.board.name, board)
            return board_etag

        else:
            board_list_etag = cache.get(f'{cls.board_list.name}:1')
            if not board_list_etag:
                board_list_etag = cls.update_cache(cls.board_list.name, '1')
            return board_list_etag


def delete_dir(path: pathlib.Path) -> None:
    try:
        shutil.rmtree(path)
    except FileNotFoundError as e:
        print(e)


def get_board_path(board: 'models.Board') -> pathlib.Path | None:
    # get first post with files, if exists, then deduce board path from it
    post = next(
        (post for post in board.posts.all() if post.images.count() > 0),
        None
    )
    if post:
        path_to_image = post.images.first().image.path
        board_dir_path = pathlib.Path(path_to_image).parent.parent.parent  # img -> img dir -> thread dir -> board dir
        return board_dir_path


# def get_ban_time_from_cache(request, board: str) -> int | None:
#     ip = request.META['REMOTE_ADDR']
#     cache_key = 'ban' + ':' + ip + ':' + board
#     banned: str | None = cache.get(cache_key)
#     if banned:
#         ban_time_remaining_secs: int = cache.ttl(cache_key)
#         if ban_time_remaining_secs and ban_time_remaining_secs > 0:
#             return ban_time_remaining_secs
#     return None


def get_user_from_header(request):
    try:
        user_id = uuid.UUID(request.headers.get('User-Id'), version=4)
        return models.User.objects.get(uuid=user_id)
    except (models.User.DoesNotExist, ValueError, TypeError):
        return None


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response:
        response.data = {'errors': response.data}
    return response


def store_ip_temporarily(request):
    ip = request.META['REMOTE_ADDR']
    cache.set(ip, '', timeout=60 * 60 * 24)


class CoercingUUIDField(UUIDField):
    """ received user_id might be tampered with // coercing to None instead of raising
        allows to continue as if nothing were passed in case of an error """

    def to_internal_value(self, data):
        if not isinstance(data, uuid.UUID):
            try:
                if isinstance(data, str):
                    return uuid.UUID(hex=data)
                else:
                    self.fail('invalid', value=data)
            except ValueError:
                data = None
        return data


def process_post_text(post_text: str):
    if not post_text:
        return post_text
    post_text = escape(post_text)
    post_text = wrap_quotes_in_anchor_tag(post_text)
    post_text = color_quoted_text(post_text)
    post_text = bbcode_parser().format(post_text)
    return post_text


@memoize
def bbcode_parser():
    parser = bbcode.Parser(install_defaults=False, escape_html=False)
    parser.add_simple_formatter('b', '<strong>%(value)s</strong>')
    parser.add_simple_formatter('i', '<em>%(value)s</em>')
    parser.add_simple_formatter('s', '<strike>%(value)s</strike>')
    parser.add_simple_formatter('code', '<code>%(value)s</code>')
    parser.add_simple_formatter('spoiler', '<span class="spoiler">%(value)s</span>', escape_html=False)
    parser.add_simple_formatter(admin_text_code, '<span class="red-text">%(value)s</span>', escape_html=False)
    return parser


def wrap_quotes_in_anchor_tag(text):
    if found_quotes := re.findall(pattern='&gt;&gt;[0-9]+', string=text):
        link = "<a class='quote-link' data-quoted='{}' href='#{}'>{}</a>"
        for quote in found_quotes:
            quote_num = quote.strip('&gt;&gt;')
            text = text.replace(quote, link.format(quote_num, quote_num, quote))
    return text


def color_quoted_text(post_string):
    quoted_text = re.findall('^\\s*&gt;.+', post_string, flags=re.MULTILINE)  # '^\s*&gt;[^&gt;].+'
    if quoted_text:
        span = "<span class='quoted-text'>{index}</span>"
        for count, index in enumerate(quoted_text):
            post_string = post_string.replace(index, span.format(index=index.strip().replace('&gt;', '>')))
    return post_string


def make_thumb(inmemory_image):
    image = PIL.Image.open(inmemory_image)
    image.thumbnail(size=(200, 220))
    output = BytesIO()
    image.save(output, quality=85, format=image.format)
    output.seek(0)
    thumb = ContentFile(output.read(), name='thumb_' + inmemory_image.name)
    return thumb


def rm_empty_dir(thread_dir_path):
    for folder in thread_dir_path.iterdir():
        folder_not_empty = next(folder.iterdir(), False)
        if folder_not_empty:
            break
        folder.rmdir()
    else:
        thread_dir_path.rmdir()


def get_image_path(instance, filename):
    if instance.post.thread:
        return f'{instance.post.board}/{instance.post.thread.pk}/images/{filename}'
    return f'{instance.post.board}/{instance.post.pk}/images/{filename}'


def get_thumb_path(instance, filename):
    post = instance.post
    if post.thread:
        return f'{post.board}/{post.thread.pk}/thumbs/{filename}'
    return f'{post.board}/{post.pk}/thumbs/{filename}'
