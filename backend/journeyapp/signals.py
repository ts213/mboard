from .models import Post
from django.db.models.signals import post_delete


def delete_callback(instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)
        instance.thumb.delete(save=False)


post_delete.connect(delete_callback, sender=Post)
