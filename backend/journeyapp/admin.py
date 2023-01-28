from django.contrib import admin
from .models import Post, Board


class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'text',  'thread', 'poster', 'board']


class BoardAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'link']


admin.site.register(Post, PostAdmin)
admin.site.register(Board, BoardAdmin)
