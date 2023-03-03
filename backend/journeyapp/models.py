import pathlib
from .utils import also_delete_folder_if_empty, path_for_image, path_for_thumb
from django.db import models


class Post(models.Model):
    thread = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='posts')
    poster = models.CharField(max_length=35, blank=True)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)
    bump = models.DateTimeField(auto_now=True)
    board = models.ForeignKey('Board', on_delete=models.CASCADE)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return str(self.pk)

    def delete(self: 'Post', *args, **kwargs):  # "delete is not necessarily called when deleting objects in bulk"
        if images := self.images.all():
            thread_dir_path = pathlib.Path(images[0].image.path).parent.parent  # img -> img dir -> thread dir
            for image_model in images:
                image_model.image.delete(save=None)
                image_model.thumb.delete(save=None)
            also_delete_folder_if_empty(thread_dir_path)
        super().delete(*args, **kwargs)

    # def save(self, *args, **kwargs):
    # if (saved_file := self.file) and self.id is None:
    # if self.id is None:
    #     saved_file, saved_thumb = self.file, self.thumb
    #     self.file = self.thumb = None
    #     super().save(*args, **kwargs)
    #     self.file, self.thumb = saved_file, saved_thumb
    #     kwargs.pop('force_insert', None)
    # super().save(*args, **kwargs)


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(blank=False, null=False, upload_to=path_for_image)
    thumb = models.ImageField(blank=False, null=False, upload_to=path_for_thumb)

    def __str__(self):
        return self.image.name


class Board(models.Model):
    title = models.CharField(max_length=20, null=False, blank=False)
    link = models.CharField(max_length=5, null=False, blank=False)

    def __str__(self):
        return self.link
