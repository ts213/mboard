from django.contrib import admin
from .models import Post, Board, Image
import time


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # list_display = ['time_ago', 'id', 'text', 'thread', 'poster', 'board', 'images']
    list_display = ['time_ago', 'id', 'text', 'thread', 'poster', 'board']

    def time_ago(self, post):
        delta = time.time() - post.date.timestamp()
        return display_time(delta)

    # def images(self, post):
    #     return post.image_set.count()


@admin.register(Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'link']


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['post', 'image', 'thumb']


intervals = (
    # ('weeks', 604800),  # 60 * 60 * 24 * 7
    ('days', 86400),  # 60 * 60 * 24
    ('hours', 3600),  # 60 * 60
    ('minutes', 60),
    # ('seconds', 1),
)


def display_time(seconds, granularity=1):
    result = []

    for name, count in intervals:
        value = round(seconds // count)
        if value:
            seconds -= value * count
            if value == 1:
                name = name.rstrip('s')
            result.append("{} {}".format(value, name))
    return ', '.join(result[:granularity])

