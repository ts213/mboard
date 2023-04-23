from django.db.models.signals import post_save
from django.core.cache import cache
from django.dispatch import receiver
from .models import Board


@receiver(post_save, sender=Board)
def clear_cache_on_board_create(sender, **kwargs):
    if cache.get('boards_list'):
        cache.delete('boards_list')
