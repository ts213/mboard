import re
import uuid
from io import BytesIO
import PIL.Image
from django.core.files.base import ContentFile
from django.utils.html import escape
from django.core.cache import cache
from rest_framework.serializers import UUIDField
from rest_framework.views import exception_handler
import board.models as models


def check_if_banned(request, board: str) -> int | None:
    ip = request.META['REMOTE_ADDR']
    cache_key = 'ban' + ':' + ip + ':' + board
    banned: str | None = cache.get(cache_key)
    if banned:
        ban_time_remaining_secs: int = cache.ttl(cache_key)
        if ban_time_remaining_secs and ban_time_remaining_secs > 0:
            return ban_time_remaining_secs
    return None


def ban_user(request, post: 'models.Post'):
    if ban_time := request.query_params.get('ban', None):
        user = get_user_from_header(request)

        try:
            ban_time = int(ban_time)

            assert user is not False
            assert user_is_janny(user, post)
            assert 30 >= ban_time >= 1
        except (AssertionError, ValueError):
            return

        ip = request.META['REMOTE_ADDR']
        ban_time_days_to_secs = ban_time * 24 * 60 * 60
        cache.set('ban' + ':' + ip + ':' + post.board.link,
                  '1',
                  timeout=ban_time_days_to_secs)
        return True


def user_is_janny(user: 'models.User', post: 'models.Post'):
    if user.boards.contains(post.board):
        return True


def get_user_from_header(request):
    if user_id := request.headers.get('User-Id', None):

        try:
            return models.User.objects.get(uuid=user_id)
        except models.User.DoesNotExist:
            return False


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response:
        response.data = {'errors': response.data}
    return response


def store_ip_temporarily(request):
    ip = request.META['REMOTE_ADDR']
    cache.set(ip, '', timeout=60 * 60 * 24)


class CoercingUUIDField(UUIDField):
    """ passed user_id might be tampered with // coercing to None instead of raising
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


def process_post_text(post_text):
    """escapes user input, converts '>>' to links, colours quoted text"""
    post_text = escape(post_text)
    post_text = wrap_quoted_text_in_tag(post_text)
    post_text = insert_anchor_tag(post_text)
    return post_text


def wrap_quoted_text_in_tag(post_text: str):
    def callback(match_obj):
        span = '<span style="color:red">{repl}</span>'
        return span.format(repl=match_obj.group(0).strip())

    post_text = re.sub('^\\s*::.+(?m)', callback, post_text)
    return post_text


def insert_anchor_tag(post_text: str):
    def callback(match_obj):
        found_quote = match_obj.group(0)
        span = ('<a'
                ' class="quote-link"'
                ' data-quoted={}'
                ' href="#{}/">'
                '{}'
                '</a>')
        return span.format(found_quote.strip('gt;&gt;'),
                           found_quote.strip('gt;&gt;'),
                           found_quote.strip())

    post_text = re.sub('^\\s*&gt;&gt;[0-9]+(?m)', callback, post_text)
    return post_text


def make_thumb(inmemory_image):
    image = PIL.Image.open(inmemory_image)
    image.thumbnail(size=(200, 220))
    output = BytesIO()
    image.save(output, quality=85, format=image.format)
    output.seek(0)
    thumb = ContentFile(output.read(), name='thumb_' + inmemory_image.name)
    return thumb


def delete_folder_if_empty(thread_dir_path):
    for folder in thread_dir_path.iterdir():
        folder_not_empty = next(folder.iterdir(), False)
        if folder_not_empty:
            break
        folder.rmdir()
    else:
        thread_dir_path.rmdir()


def path_for_image(instance, filename):
    if instance.post.thread:
        return f'{instance.post.board}/{instance.post.thread.pk}/images/{filename}'
    return f'{instance.post.board}/{instance.post.pk}/images/{filename}'


def path_for_thumb(instance, filename):
    post = instance.post
    if post.thread:
        return f'{post.board}/{post.thread.pk}/thumbs/{filename}'
    return f'{post.board}/{post.pk}/thumbs/{filename}'
