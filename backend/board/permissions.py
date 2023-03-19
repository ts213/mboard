from rest_framework import permissions
from .models import Post


class EditPostPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, post: Post):
        post_editor = request.headers.get('userid', None)
        post_author = str(post.userid)
        forbidden = \
            post_editor is None or \
            post_editor != post_author or \
            post.edited_at is not None
        return not forbidden


class DeletePostPermission(EditPostPermission):
    def has_object_permission(self, request, view, post: Post):
        post_editor = request.headers.get('userid', None)
        post_author = str(post.userid)
        forbidden = \
            post_editor is None or \
            post_editor != post_author
        return not forbidden
