from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .utils import RoutesCache
from .models import Board, Post


@receiver(post_save, sender=Post)
def update_board_cache_on_save(instance: Post, **_):
    RoutesCache.update_cache(RoutesCache.board.name, instance.board.link)


@receiver(post_delete, sender=Post)
def update_board_cache_on_delete(instance, **_):
    RoutesCache.update_cache(RoutesCache.board.name, instance.board.link)


@receiver(post_save, sender=Board)
def update_board_list_cache_on_save(**_):
    RoutesCache.update_cache(RoutesCache.board_list.name, '1')


@receiver(post_delete, sender=Board)
def update_board_list_cache_on_delete(**_):
    RoutesCache.update_cache(RoutesCache.board_list.name, '1')
