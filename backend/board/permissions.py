from rest_framework import permissions
from django.utils import timezone
from .models import Post, User
from .utils import user_is_janny


class PostPermission(permissions.BasePermission):
    allowed_interval = 60 * 60 * 24  # day
    user = None
    message = None

    def has_permission(self, request, view):
        forbidden = False

        if request.method == 'POST':
            try:
                # self.check_ban(request, board=view.kwargs.get('board'))

                post = Post.objects.get(pk=request.data.get('thread'))
                self.is_thread_not_closed(post)
                return not forbidden
            except AssertionError:
                return forbidden
            except Post.DoesNotExist:  # new thread
                return not forbidden
        else:
            return not forbidden

    def has_object_permission(self, request, view,
                              post: Post | None,
                              user: User | None = None):
        """ called after 'has_permission' for all methods except POST """
        forbidden = False

        if request.method in permissions.SAFE_METHODS:
            return not forbidden

        try:
            self.user = user
            assert user

            if self.is_global_janny():
                return not forbidden

            if request.method == 'DELETE':
                self.is_thread_not_closed(post)
                if self.is_janny(post):
                    return not forbidden

            if request.method == 'PATCH':
                patch_type = request.data.get('type')
                match patch_type:
                    case 'edit':
                        self.has_post_been_edited(post)
                        self.is_thread_not_closed(post)
                    case 'close':
                        assert self.is_janny(post)
                        return not forbidden
                    case None:
                        raise AssertionError

            self.verify_user(post, self.user)
            self.is_not_thread(post)
            self.is_allowed_interval(post)

            return not forbidden
        except AssertionError:
            return forbidden

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

    # def check_ban(self, request, board):
    #     if ban_time := get_ban_time_from_cache(request, board=board):
    #         self.message = {'type': 'ban', 'detail': ban_time}
    #         raise AssertionError
