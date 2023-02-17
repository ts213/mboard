from django.db import models


class Post(models.Model):
    thread = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    poster = models.CharField(max_length=35, blank=True)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)
    bump = models.DateTimeField(auto_now=True)
    board = models.ForeignKey('Board', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.pk)

    # def save(self, *args, **kwargs):
        # if (saved_file := self.file) and self.id is None:
        # if self.id is None:
        #     saved_file, saved_thumb = self.file, self.thumb
        #     self.file = self.thumb = None
        #     super().save(*args, **kwargs)
        #     self.file, self.thumb = saved_file, saved_thumb
        #     kwargs.pop('force_insert', None)
        # super().save(*args, **kwargs)

    def is_thread(self):
        return self.thread is None


def path_for_image(instance, filename):
    if instance.post.thread:
        return f'{instance.post.board}/{instance.post.thread.pk}/images/{filename}'
    return f'{instance.post.board}/{instance.post.pk}/images/{filename}'


def path_for_thumb(instance, filename):
    post = instance.post
    if post.thread:
        return f'{post.board}/{post.thread.pk}/thumbs/{filename}'
    return f'{post.board}/{post.pk}/thumbs/{filename}'


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(blank=False, null=False, upload_to=path_for_image)
    thumb = models.ImageField(blank=False, null=False, upload_to=path_for_thumb)


class Board(models.Model):
    title = models.CharField(max_length=20, null=False, blank=False)
    link = models.CharField(max_length=5, null=False, blank=False)

    def __str__(self):
        return self.link
