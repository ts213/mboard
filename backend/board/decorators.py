from functools import wraps
from typing import Callable
from urllib.request import urlopen
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from djangoconf import settings
from .models import Post, User


def log_deleted_post(delete_post: Callable[[APIView, Post], None]) -> Callable:

    def log_into_file(deleter: User, post: Post, post_id: int):
        def get_deleter_role():
            if post.user.uuid == deleter.uuid:
                return 'user'
            elif deleter.global_janny is True:
                return 'admin'
            else:
                return f'/{post.board.link}/'

        try:
            with open(f'{settings.BASE_DIR}/deleted.log', 'a') as f:
                line = '{id} {thread_id} /{board}/ {who} {time}'.format(
                    id=post_id,
                    thread_id=post.thread_id,
                    board=post.board.link,
                    who=get_deleter_role(),
                    time=timezone.now().strftime('%d/%m/%Y/%H:%M'),
                ).split(' ')

                f.write('{:<10}  {:<10}  {:<10} {:<10} {:<10}\n'.format(*line))
        except Exception as e:
            print(e)

    @wraps(delete_post)
    def delete_post_and_log(self, post):
        post_id = post.pk
        delete_post(self, post)
        log_into_file(self.user, post, post_id)

    if settings.env.get('DELETED_LOG') == 'True':
        return delete_post_and_log
    return delete_post


def block_proxies(create_new_post: Callable):
    def test_suspicious_ip(request):
        ip = request.META.get("REMOTE_ADDR")
        bad_ip = False
        url = 'https://check.getipintel.net/check.php?flag={flag}&ip={ip}&contact={email}'
        full_url = url.format(flag='m', ip=ip, email=settings.EMAIL)
        try:
            ip_check_response = urlopen(full_url)
            ip_is_bad_chance = ip_check_response.read().decode()
            if float(ip_is_bad_chance) >= 0.99:
                bad_ip = True
        except Exception as e:  # noqa
            pass
        finally:
            return bad_ip

    def decline_posting():
        return Response({'errors': {'detail': 'Proxy/VPN'}}, status=403)

    @wraps(create_new_post)
    def wrapper(request, *args, **kwargs):
        bad_ip = test_suspicious_ip(request)
        if bad_ip:
            return decline_posting()
        return create_new_post(request, *args, **kwargs)

    if settings.BLOCK_PROXIES:
        return wrapper
    return create_new_post
