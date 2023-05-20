import pathlib
import uuid
from django.db import models
from django.utils import timezone
from django.core.cache import cache
from datetime import timedelta
from .utils import rm_empty_dir, get_image_path, get_thumb_path, process_post_text, \
    get_board_path, delete_dir, set_cache
from djangoconf.settings import env

THREAD_REPLIES_LIMIT = int(env.get('REPLIES_LIMIT'))
PRUNE_BOARDS_AFTER = int(env.get('PRUNE_BOARDS_AFTER'))
MAIN_BOARDS_COUNT = int(env.get('MAIN_BOARDS_COUNT'))


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
    closed = models.BooleanField(default=False)

    poster = models.CharField(max_length=35, blank=True)
    text = models.TextField(max_length=10000, blank=True)

    date = models.DateTimeField(auto_now_add=True)
    bump = models.DateTimeField(auto_now_add=True, null=True)
    edited_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return str(self.pk)

    def save(self: 'Post', *args, **kwargs):
        self.text = process_post_text(self.text)

        super().save(*args, **kwargs)

        self.bump_board()
        if self.thread:
            self.prune_replies()
            self.bump_thread()

        set_cache({
            'thread': self.get_thread_pk(),
            'board': self.board.link,
        })

    def delete(self: 'Post', *args, **kwargs):  # "docs: delete is not necessarily called when deleting in bulk"
        if images := self.images.all():  # should be after delete() todo
            thread_dir_path = pathlib.Path(images[0].image.path).parent.parent  # img -> img dir -> thread dir
            for image_model in images:
                image_model.image.delete(save=None)
                image_model.thumb.delete(save=None)
            rm_empty_dir(thread_dir_path)

        set_cache({
            'thread': self.get_thread_pk(),
            'board': self.board.link,
        })
        return super().delete(*args, **kwargs)

    def get_thread_pk(self) -> int:
        return self.thread.pk if self.thread else self.pk

    def prune_replies(self):
        if self.thread.posts.count() >= THREAD_REPLIES_LIMIT:
            self.thread.posts.last().delete()

    def bump_thread(self):
        Post.objects.filter(pk=self.thread.pk).update(bump=timezone.now())

    def bump_board(self):
        Board.objects.filter(link=self.board.link).update(bump=timezone.now())

    def reset_cache(self):
        thread_pk = self.get_thread_pk()
        cache.delete(key=f'thread:{thread_pk}')


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
    bump = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ['-bump']

    def save(self: 'Board', *args, **kwargs):
        assert len(self.link) > 0 and len(self.title) > 0, 'length'
        self.prune_inactive_boards()

        if Board.objects.count() <= MAIN_BOARDS_COUNT:
            self.userboard = False

        set_cache({'board_list': '1', })

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):  # add frontend board del todo
        board_files_path = get_board_path(self)
        super().delete(*args, **kwargs)

        if board_files_path:
            delete_dir(board_files_path)

        set_cache({'board_list': '1', })

    def __str__(self):
        return self.link

    @staticmethod
    def prune_inactive_boards():
        inactivity_threshold = timezone.now() - timedelta(days=PRUNE_BOARDS_AFTER)
        if boards := Board.objects.filter(bump__lt=inactivity_threshold):
            for b in boards:
                b.delete()
