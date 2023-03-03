from io import BytesIO
from django.core.files.base import ContentFile
import re
import PIL.Image
from django.utils.html import escape


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


def also_delete_folder_if_empty(thread_dir_path):
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
