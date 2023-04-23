from rest_framework import permissions
from django.utils import timezone
from .models import Post


class PostPermission(permissions.BasePermission):
    allowed_time = 60 * 60 * 24  # day

    def has_object_permission(self, request, view, post: Post):
        forbidden = False

        if request.method == 'GET':
            return not forbidden

        post_editor = request.headers.get('User-Id', None)
        post_author = str(post.user.uuid)
        time_diff_secs = (timezone.now() - post.date).seconds

        if request.method == 'DELETE':
            forbidden = \
                time_diff_secs > self.allowed_time or \
                post_editor is None or \
                post_editor != post_author

        elif request.method == 'PATCH':
            forbidden = \
                time_diff_secs > self.allowed_time or \
                post_editor is None or \
                post_editor != post_author or \
                post.edited_at is not None

        return not forbidden

