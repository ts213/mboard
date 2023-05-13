from datetime import timedelta
from django.db.models import Prefetch, Count, Q
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status, exceptions
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from .models import Post, Board
from . import serializers
from .permissions import ChangePostPermission, NewPostPermission
from .pagination import ThreadListPagination, SingleThreadPagination
from .utils import ban_user
from djangoconf.settings import env


class ThreadListAPI(generics.ListAPIView):
    serializer_class = serializers.ThreadListSerializer
    pagination_class = ThreadListPagination

    def get_queryset(self):
        self.board = get_object_or_404(Board, link=self.kwargs.get('board', None))
        self.request.kwargs = self.kwargs  # for paginator

        threads_queryset = Post.objects \
            .select_related('board').prefetch_related('images') \
            .filter(board=self.board, thread__isnull=True) \
            .order_by('-bump')

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
        return {'request': None,  # for relative urls
                'format': self.format_kwarg, 'view': self}


class ThreadAPI(generics.ListCreateAPIView):
    serializer_class = serializers.SinglePostSerializer
    pagination_class = SingleThreadPagination
    USE_THROTTLE = env.get('USE_THROTTLE')
    permission_classes = [NewPostPermission]

    def get_queryset(self):
        pk = self.kwargs['thread_id']
        board = self.kwargs['board']
        self.thread = get_object_or_404(Post, board=board, pk=pk, thread__pk=None)
        self.request.kwargs = self.kwargs  # for paginator

        thread_replies = self.thread.posts.all().select_related('board').prefetch_related('images')
        return thread_replies

    def list(self, request, *args, **kwargs):
        replies_queryset = self.get_queryset()
        thread_serialized = serializers.SinglePostSerializer(self.thread).data

        page = self.paginate_queryset(replies_queryset)
        if page is not None:
            replies_serialized = self.get_serializer(page, many=True).data
            thread_serialized['replies'] = reversed(replies_serialized)
            data = self.get_paginated_response(thread_serialized).data
        else:
            replies_serialized = self.get_serializer(replies_queryset, many=True).data
            thread_serialized['replies'] = reversed(replies_serialized)
            data = {'board': self.request.kwargs['board'],
                    'thread': thread_serialized}

        return Response(data)

    def post(self, request, *args, **kwargs):
        if request.data.get('image', None):
            images_list = request.data.pop('image')
            request.data.setlist('images_write', images_list)
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        response_data = {'created': 1, 'post': serializer.data}
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    def get_serializer_context(self):
        return {'request': None,  # for relative urls
                'format': self.format_kwarg,
                'view': self,
                }

    def get_throttles(self):
        if self.request.method == 'POST' and self.USE_THROTTLE:
            return [self.PostRequestThrottle()]
        return [throttle() for throttle in self.throttle_classes]

    def throttled(self, request, wait):
        raise exceptions.Throttled(detail={'message': 'Wait before posting again'})

    class PostRequestThrottle(AnonRateThrottle):
        rate = env.get('POST_THROTTLE')
        scope = 'anon_post'

        def get_cache_key(self, request, view):
            return self.cache_format % {
                'scope': self.scope,
                'ident': self.get_ident(request)
            }


class BoardsAPI(generics.ListCreateAPIView):
    queryset = Board.objects.all()
    serializer_class = serializers.BoardSerializer
    use_boards_cache = env.get('USE_BOARDS_CACHE', False)
    cache_time = env.get('BOARDS_CACHE_TIME')

    def dispatch(self, request, *args, **kwargs):
        if request.method == 'GET' and self.use_boards_cache:
            if data := cache.get('boards_list'):
                return JsonResponse(data, safe=False)
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        last_24h = timezone.now() - timedelta(days=1)
        return Board.objects.all().annotate(
            posts_count=Count('posts'),
            posts_last24h=Count(
                'posts',
                filter=Q(posts__date__gt=last_24h)
            )
        ).order_by('-posts_last24h')[:30]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        if self.use_boards_cache:
            cache.set('boards_list', serializer.data, timeout=self.cache_time)  # caching for 5 min
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = {'created': 1, 'board': response.data}
        return response

    def get_throttles(self):
        if self.request.method == 'POST':
            return [self.BoardCreationThrottle()]
        return [throttle() for throttle in self.throttle_classes]

    def throttled(self, request, wait):
        raise exceptions.Throttled(detail={'message': 'too many requests'})

    class BoardCreationThrottle(AnonRateThrottle):
        rate = env.get('NEW_BOARD_THROTTLE')


class PostAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.SinglePostSerializer
    permission_classes = [ChangePostPermission]
    lookup_field = 'pk'
    lookup_url_kwarg = 'post_id'
    http_method_names = ['get', 'delete', 'patch']

    def perform_update(self, serializer):
        serializer.save(edited_at=timezone.now())

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({'post': response.data, 'created': 1})

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        post_id, thread_id, board = post.id, post.thread_id, post.board_id
        self.perform_destroy(post, request)
        data = {'deleted': 1,
                'post': {'id': post_id,
                         'thread': thread_id,
                         'board': board}}
        return Response(status=status.HTTP_200_OK, data=data)

    def perform_destroy(self, post: Post, request):  # noqa
        ban_user(request, post)
        post.delete()
