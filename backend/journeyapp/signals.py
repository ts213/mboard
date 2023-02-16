import pathlib
from .models import Post
from django.db.models.signals import post_delete


def delete_callback(instance, **kwargs):
    if instance.file:
        parent_dir_path = pathlib.Path(instance.file.path).parent.parent

        instance.file.delete(save=False)
        instance.thumb.delete(save=False)

        also_delete_folder_if_its_empty(parent_dir_path)


post_delete.connect(delete_callback, sender=Post)


def also_delete_folder_if_its_empty(parent_dir_path):
    for folder in parent_dir_path.iterdir():
        folder_not_empty = next(folder.iterdir(), False)
        if folder_not_empty:
            break
        folder.rmdir()
    else:
        parent_dir_path.rmdir()
