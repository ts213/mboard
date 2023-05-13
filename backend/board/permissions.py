from rest_framework import permissions
from django.utils import timezone
from .models import Post
from .utils import get_user_from_header, user_is_janny, check_if_banned


class NewPostPermission(permissions.BasePermission):
    message = None

    def has_permission(self, request, view):
        if request.method == 'POST':
            if ban_time := check_if_banned(request, board=view.kwargs.get('board')):
                self.message = {'type': 'ban', 'message': ban_time}
                return False

        return True


class ChangePostPermission(permissions.BasePermission):
    allowed_interval = 60 * 60 * 24  # day

    def has_object_permission(self, request, view, post: Post):
        forbidden = False

        if request.method == 'GET':
            return not forbidden

        try:
            self.header_has_userid(request)

            if request.method == 'DELETE':
                if self.is_janny(post):
                    return not forbidden

            if request.method == 'PATCH':
                self.post_was_not_edited(post)

            self.verify_user(post, self.user)
            self.is_not_thread(post)
            self.is_allowed_interval(post)

            return not forbidden
        except AssertionError:
            return forbidden

    def header_has_userid(self, request):
        self.user = get_user_from_header(request)
        assert self.user is not None

    def is_janny(self, post):
        return user_is_janny(self.user, post)

    def verify_user(self, post, user):
        assert user == post.user

    def is_not_thread(self, post):
        assert post.thread is not None

    def is_allowed_interval(self, post):
        time_diff_secs = (timezone.now() - post.date).total_seconds()
        assert time_diff_secs <= self.allowed_interval

    def post_was_not_edited(self, post):
        assert post.edited_at is None
