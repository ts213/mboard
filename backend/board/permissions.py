from rest_framework import permissions
from django.utils import timezone
from .models import Post


class EditPostPermission(permissions.BasePermission):
    allowed_edit_time = 60 * 60 * 24  # day

    def has_object_permission(self, request, view, post: Post):
        post_editor = request.headers.get('userid', None)
        post_author = str(post.userid)
        time_diff_secs = (timezone.now() - post.date).seconds

        forbidden = \
            time_diff_secs > self.allowed_edit_time or \
            post_editor is None or \
            post_editor != post_author or \
            post.edited_at is not None
        return not forbidden


class DeletePostPermission(permissions.BasePermission):
    allowed_edit_time = 60 * 60 * 24  # day

    def has_object_permission(self, request, view, post: Post):
        post_editor = request.headers.get('userid', None)
        post_author = str(post.userid)
        time_diff_secs = (timezone.now() - post.date).seconds

        forbidden = \
            time_diff_secs > self.allowed_edit_time or \
            post_editor is None or \
            post_editor != post_author
        return not forbidden
