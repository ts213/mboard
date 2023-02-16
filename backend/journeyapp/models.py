from django.db import models


def upload_to(instance, filename):
    # print(dir(instance))
    if instance.thread:
        print(instance.thread)
        return f'{instance.thread.pk}/images/{filename}'
    print('n', instance.thread)
    return f'{instance.pk}/images/{filename}'


class Post(models.Model):
    thread = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    poster = models.CharField(max_length=35, blank=True)
    text = models.TextField(max_length=10000)
    date = models.DateTimeField(auto_now_add=True)
    file = models.ImageField(blank=True, upload_to=upload_to)  # naming ????
    thumb = models.ImageField(blank=True, upload_to='thumbs/%Y/%m/%d/')
    # video = models.FileField(blank=True, upload_to='post/videos/%Y/%m/%d/')
    # videothumb = models.ImageField(blank=True, upload_to='post/thumbs/%Y/%m/%d/')
    bump = models.DateTimeField(auto_now=True)
    board = models.ForeignKey('Board', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.pk)

    def save(self, *args, **kwargs):
        if (saved_file := self.file) and self.id is None:
            print('aaa', saved_file)
            self.file = None
            super().save(*args, **kwargs)
            self.file = saved_file
            kwargs.pop('force_insert', None)
        super().save(*args, **kwargs)

    def is_thread(self):
        return self.thread is None


class Board(models.Model):
    title = models.CharField(max_length=20, null=False, blank=False)
    link = models.CharField(max_length=5, null=False, blank=False)

    def __str__(self):
        return self.link

#
# class File(models.Model):
#     post = models.ForeignKey(Post, on_delete=models.CASCADE)
#     file = models.ImageField(upload_to='files/%Y/%m/')
#     thumb = models.ImageField(upload_to='thumbs/%Y/%m/')
