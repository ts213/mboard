from rest_framework import permissions
from django.utils import timezone
from .models import Post
from .utils import get_user_from_header, user_is_janny, get_ban_time_from_cache


class PostPermission(permissions.BasePermission):
    allowed_interval = 60 * 60 * 24  # day
    user = None
    message = None

    def has_permission(self, request, view):
        forbidden = False

        if request.method == 'POST':
            try:
                self.check_ban(request, board=view.kwargs.get('board'))

                post = Post.objects.get(pk=request.data.get('thread'))
                self.is_thread_not_closed(post)
                return not forbidden
            except AssertionError:
                return forbidden
            except Post.DoesNotExist:  # new thread
                return not forbidden
        else:
            return not forbidden

    def has_object_permission(self, request, view, post: Post | None):
        forbidden = False

        if request.method in permissions.SAFE_METHODS:
            return not forbidden

        try:
            self.header_has_userid(request)

            if self.is_global_janny():
                return not forbidden

            if request.method == 'DELETE':
                self.is_thread_not_closed(post)
                if self.is_janny(post):
                    return not forbidden

            if request.method == 'PATCH':
                if self.determine_safe_patch_action(request, post):
                    return not forbidden

            self.verify_user(post, self.user)
            self.is_not_thread(post)
            self.is_allowed_interval(post)

            return not forbidden
        except AssertionError:
            return forbidden

    def header_has_userid(self, request):
        self.user = get_user_from_header(request)
        assert self.user is not None

    def is_global_janny(self):
        return self.user.global_janny is True

    def is_janny(self, post):
        return user_is_janny(self.user, post)

    @staticmethod
    def verify_user(post, user):
        assert user == post.user

    @staticmethod
    def is_not_thread(post):
        assert post.thread is not None

    def is_allowed_interval(self, post):
        time_diff_secs = (timezone.now() - post.date).total_seconds()
        assert time_diff_secs <= self.allowed_interval

    @staticmethod
    def has_post_been_edited(post):
        assert post.edited_at is None

    @staticmethod
    def is_thread_not_closed(post):
        if post.thread:
            assert post.thread.closed is False
        assert post.closed is False

    def determine_safe_patch_action(self, request, post):
        match request.data.get('type'):
            case 'edit':
                self.has_post_been_edited(post)
                self.is_thread_not_closed(post)
                return False
            case 'close':
                assert self.is_janny(post)
                return True
            case None:
                raise AssertionError

    def check_ban(self, request, board):
        if ban_time := get_ban_time_from_cache(request, board=board):
            self.message = {'type': 'ban', 'detail': ban_time}
            raise AssertionError
