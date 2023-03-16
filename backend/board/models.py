import pathlib
from django.db import models
from django.db import IntegrityError
from .utils import delete_folder_if_empty, path_for_image, path_for_thumb


class Post(models.Model):
    thread = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='posts')
    poster = models.CharField(max_length=35, blank=True)
    text = models.TextField(max_length=10000, blank=True)
    board = models.ForeignKey('Board', on_delete=models.CASCADE)
    id = models.BigAutoField(primary_key=True)
    userid = models.UUIDField(editable=True, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    bump = models.DateTimeField(auto_now=True)
    edited_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return str(self.pk)

    def save(self, *args, **kwargs):
        if self.thread and self.thread.thread:
            raise IntegrityError('Post cannot have another post as its thread')
        return super().save(*args, **kwargs)

    def delete(self: 'Post', *args, **kwargs):  # "docs: delete is not necessarily called when deleting in bulk"
        if images := self.images.all():
            thread_dir_path = pathlib.Path(images[0].image.path).parent.parent  # img -> img dir -> thread dir
            for image_model in images:
                image_model.image.delete(save=None)
                image_model.thumb.delete(save=None)
            delete_folder_if_empty(thread_dir_path)

        return super().delete(*args, **kwargs)


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(blank=False, null=False, upload_to=path_for_image)
    thumb = models.ImageField(blank=False, null=False, upload_to=path_for_thumb)

    def __str__(self):
        return self.image.name


class Board(models.Model):
    link = models.CharField(primary_key=True, max_length=5, null=False, blank=False)
    title = models.CharField(max_length=20, null=False, blank=False)

    def __str__(self):
        return self.link
