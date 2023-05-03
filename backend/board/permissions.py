from rest_framework import permissions
from django.utils import timezone
from .models import Post, User


class PostPermission(permissions.BasePermission):
    allowed_time = 60 * 60 * 24  # day

    def has_object_permission(self, request, view, post: Post):
        forbidden = False

        if request.method == 'GET':
            return not forbidden

        user_id = request.headers.get('User-Id', None)
        try:
            user = User.objects.get(uuid=user_id)
        except User.DoesNotExist:
            return forbidden

        if user.boards.contains(post.board):
            return not forbidden

        if not post.thread:
            return forbidden

        time_diff_secs = (timezone.now() - post.date).seconds

        forbidden = \
            time_diff_secs > self.allowed_time or \
            user != post.user

        if request.method == 'PATCH':
            forbidden = post.edited_at is not None

        return not forbidden
