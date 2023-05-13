import pathlib
import uuid
from django.db import models
from django.db import IntegrityError
from django.utils import timezone
from django.core.cache import cache
from .utils import rm_empty_dir, get_image_path, get_thumb_path, process_post_text, prune_inactive_boards, \
    get_board_path, delete_dir
from djangoconf.settings import env

REPLIES_LIMIT = int(env.get('REPLIES_LIMIT'))


class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(
        default=uuid.uuid4)  # https://docs.djangoproject.com/en/dev/ref/databases/#manually-specified-autoincrement-pk
    boards = models.ManyToManyField('Board', related_name='janny')

    def save(self, *args, **kwargs):
        if self.uuid is None:
            self.uuid = uuid.uuid4()

        return super().save(*args, **kwargs)

    def __str__(self):
        return str(self.uuid)


class Post(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='posts', null=True, blank=True)

    board = models.ForeignKey('Board', on_delete=models.CASCADE, related_name='posts')
    thread = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='posts')

    poster = models.CharField(max_length=35, blank=True)
    text = models.TextField(max_length=10000, blank=True)

    date = models.DateTimeField(auto_now_add=True)
    bump = models.DateTimeField(auto_now=True)
    edited_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-bump']

    def __str__(self):
        return str(self.pk)

    def save(self: 'Post', *args, **kwargs):
        if self.thread:
            if self.thread.thread:
                raise IntegrityError('Post cannot have another post as its thread')

            if self.thread.posts.all().count() >= REPLIES_LIMIT:
                self.thread.posts.last().delete()

            self.thread.bump = timezone.now()
            self.thread.save(update_fields=['bump'])

        if self.text:
            self.text = process_post_text(self.text)

        self.board.bump = timezone.now()
        self.board.save(update_fields=['bump'])

        super().save(*args, **kwargs)

    def delete(self: 'Post', *args, **kwargs):
        # "docs: delete is not necessarily called when deleting in bulk"
        if images := self.images.all():
            thread_dir_path = pathlib.Path(images[0].image.path).parent.parent  # img -> img dir -> thread dir
            for image_model in images:
                image_model.image.delete(save=None)
                image_model.thumb.delete(save=None)
            rm_empty_dir(thread_dir_path)

        return super().delete(*args, **kwargs)


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=get_image_path)
    thumb = models.ImageField(upload_to=get_thumb_path)

    def __str__(self):
        return self.image.name


class Board(models.Model):
    link = models.CharField(primary_key=True, max_length=5)
    title = models.CharField(max_length=15, unique=True)
    userboard = models.BooleanField(default=True)
    bump = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-bump']

    def save(self: 'Board', *args, **kwargs):
        assert len(self.link) > 0 and len(self.title) > 0, 'length'
        prune_inactive_boards()

        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        board_files_path = get_board_path(self)
        super().delete(*args, **kwargs)

        if board_files_path:
            delete_dir(board_files_path)

        cache.delete('boards_list')

    def __str__(self):
        return self.link
