from datetime import timedelta
from django.db.models import Prefetch, Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.http import etag
from rest_framework import generics, mixins, status, exceptions
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from .models import Post, Board, User
from . import serializers
from .permissions import PostPermission
from .pagination import ThreadListPagination, SingleThreadPagination
from .utils import get_user_from_header, RoutesCache
from djangoconf.settings import env
from .decorators import log_deleted_post, block_proxies


class ThreadListAPI(generics.ListAPIView):
    serializer_class = serializers.ThreadListSerializer
    pagination_class = ThreadListPagination

    def get_queryset(self):
        threads_queryset = Post.objects \
            .select_related('board').prefetch_related('images') \
            .filter(thread__isnull=True) \
            .order_by('-bump') \
            .annotate(replies_count=Count('posts'))

        if self.kwargs.get('board') == 'all':
            pass
        else:
            board = get_object_or_404(Board, link=self.kwargs.get('board', None))
            threads_queryset = threads_queryset.filter(board=board)

        self.request.kwargs = self.kwargs  # for paginator

        thread_replies_qset = Post.objects \
                                  .select_related('board').prefetch_related('images') \
                                  .filter(thread__in=threads_queryset
                                          )[:4]

        threads_w_replies = threads_queryset.prefetch_related(
            Prefetch(lookup='posts',
                     queryset=thread_replies_qset,  # queryset for lookup (override Django query)
                     to_attr='replies')
        )
        return threads_w_replies

    @method_decorator(etag(RoutesCache.get_etag))
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = self.get_paginated_response(serializer.data).data
        else:
            data = self.get_serializer(queryset, many=True).data
        return Response(data)

    def get_serializer_context(self):
        return {
            'request': None,  # for relative urls
            'format': self.format_kwarg,
            'view': self,
            'method': self.request.method,
        }


class ThreadAPI(generics.RetrieveUpdateDestroyAPIView, mixins.CreateModelMixin):
    serializer_class = serializers.SinglePostSerializer
    pagination_class = SingleThreadPagination
    USE_THROTTLE = env.get('USE_THROTTLE')
    permission_classes = [PostPermission]
    http_method_names = ['get', 'post', 'patch', 'delete']

    @method_decorator(etag(RoutesCache.get_etag))
    def get(self, request, *args, **kwargs):
        thread: Post = self.get_object()
        replies: [Post] = self.get_replies_queryset(thread)

        thread_data = serializers.SinglePostSerializer(thread).data
        thread_data['replies'] = self.paginate_replies(replies)
        response_data = self.get_paginated_response(thread_data).data
        return Response(response_data)

    def get_object(self):
        pk = self.kwargs.get('thread_id')
        board = self.kwargs.get('board')
        post = get_object_or_404(Post, board=board, pk=pk)
        self.check_object_permissions(self.request, post)
        return post

    def check_object_permissions(self, request, obj):
        permission = PostPermission()
        self.user: User | None = get_user_from_header(self.request)

        if not permission.has_object_permission(request, self, obj, self.user):
            self.permission_denied(
                request,
                message=getattr(permission, 'message', None),
                code=getattr(permission, 'code', None)
            )

    @staticmethod
    def get_replies_queryset(thread):
        thread_replies = thread.posts.all().select_related('board').prefetch_related('images')
        return thread_replies

    def paginate_replies(self, replies):
        self.request.kwargs = self.kwargs  # for paginator
        page = self.paginate_queryset(replies)
        replies_data = self.get_serializer(page, many=True).data
        return reversed(replies_data)

    @method_decorator(block_proxies)
    def post(self, request, *args, **kwargs):
        if request.data.get('image', None):
            images_list = request.data.pop('image')
            request.data.setlist('images_write', images_list)
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        headers = self.get_success_headers(serializer.data)
        response_data = {'created': 1, 'post': serializer.data}
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer_context(self):
        return {
            'request': None,  # for relative urls
            'format': self.format_kwarg,
            'view': self,
            'method': self.request.method,
        }

    def get_throttles(self):
        if self.request.method == 'POST' and self.USE_THROTTLE:
            return [self.PostRequestThrottle()]
        return [throttle() for throttle in self.throttle_classes]

    def throttled(self, request, wait):
        class ThreadThrottle(exceptions.Throttled):
            default_detail = ''
            extra_detail_singular = 'Wait {wait} second'
            extra_detail_plural = 'Wait {wait} seconds'

        raise ThreadThrottle(wait)

    class PostRequestThrottle(AnonRateThrottle):
        rate = env.get('POST_THROTTLE')
        scope = 'anon_post'

        def get_cache_key(self, request, view):
            return self.cache_format % {
                'scope': self.scope,
                'ident': self.get_ident(request)
            }

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = self.get_data_for_update(request, instance)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save(edited_at=timezone.now())

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response({'post': serializer.data, 'created': 1})

    @staticmethod
    def get_data_for_update(request, instance: Post):
        """ get only updatable fields, discarding other possibly passed fields """
        data = {}
        match request.data.get('type'):
            case 'edit':
                data['text'] = request.data.get('text')
            case 'close':
                data['closed'] = not instance.closed
        return data

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        post_id, thread_id, board = post.id, post.thread_id, post.board.link
        self.perform_destroy(post)
        data = {
            'deleted': 1,
            'post': {
                'id': post_id,
                'thread': thread_id,
                'board': board,
            }
        }
        return Response(status=status.HTTP_200_OK, data=data)

    @log_deleted_post
    def perform_destroy(self, post: Post):
        post.delete(self.user)


class BoardsAPI(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = serializers.BoardSerializer
    USE_THROTTLE = env.get('USE_THROTTLE') == 'True'

    def initial(self, request, *args, **kwargs):
        self.format_kwarg = self.get_format_suffix(**kwargs)

        neg = self.perform_content_negotiation(request)
        request.accepted_renderer, request.accepted_media_type = neg

        version, scheme = self.determine_version(request, *args, **kwargs)
        request.version, request.versioning_scheme = version, scheme

        self.check_permissions(request)

    def get_queryset(self):
        last_24h = timezone.now() - timedelta(days=1)
        queryset = Board.objects.annotate(
            posts_count=Count('posts'),
            posts_last24h=Count(
                'posts',
                filter=Q(posts__date__gt=last_24h)
            )
        )
        return queryset.order_by('-bump')[:25]

    @method_decorator(etag(RoutesCache.get_etag))
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @method_decorator(block_proxies)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.check_throttles(request)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response({'created': 1, 'board': serializer.data},
                        status=status.HTTP_201_CREATED, headers=headers)

    def get_throttles(self):
        if self.request.method == 'POST' and self.USE_THROTTLE:
            return [self.BoardCreationThrottle()]
        return [throttle() for throttle in self.throttle_classes]

    def throttled(self, request, wait):
        raise exceptions.Throttled(detail={'detail': 'Too many requests, try later'})

    class BoardCreationThrottle(AnonRateThrottle):
        rate = env.get('NEW_BOARD_THROTTLE')
        scope = 'anon_board_post'


class CatalogAPI(generics.ListAPIView):
    serializer_class = serializers.CatalogSerializer

    @method_decorator(etag(RoutesCache.get_etag))
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = Post.objects.filter(thread__isnull=True) \
            .prefetch_related('images')

        if self.kwargs.get('board') == 'all':
            pass
        else:
            board = get_object_or_404(Board, link=self.kwargs.get('board'))
            queryset = queryset.filter(board=board)
        return queryset[:500]

    def get_serializer_context(self):
        return {
            'request': None,
            'format': self.format_kwarg, 'view': self
        }
