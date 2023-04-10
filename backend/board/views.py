from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from .models import Board
from . import serializers
from .permissions import *
from .pagination import *


class ThreadListAPI(generics.ListAPIView):
    serializer_class = serializers.ThreadListSerializer
    pagination_class = ThreadListPagination

    def get_queryset(self):
        self.board = get_object_or_404(Board, link=self.kwargs.get('board', None))  # noqa
        self.request.kwargs = self.kwargs  # for paginator

        threads_queryset = Post.objects \
            .select_related('board').prefetch_related('images') \
            .filter(board=self.board, thread__isnull=True)

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

    def get_queryset(self):
        pk = self.kwargs['thread_id']
        board = self.kwargs['board']
        self.thread = get_object_or_404(Post, board=board, pk=pk, thread__pk=None)  # noqa
        self.request.kwargs = self.kwargs  # for paginator

        thread_replies = Post.objects.filter(board=board, thread__pk=pk) \
            .select_related('board').prefetch_related('images')
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

    def get_serializer_context(self):
        return {'request': None,  # for relative urls
                'format': self.format_kwarg, 'view': self}

    def post(self, request, *args, **kwargs):
        if request.data.get('images', None):
            images_list = request.data.pop('images')
            request.data.setlist('images_write', images_list)
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_201_CREATED,
                        data={'status': 1, 'post': response.data})


class BoardsAPI(generics.ListAPIView):
    queryset = Board.objects.all()
    serializer_class = serializers.BoardSerializer


class DeletePostAPIView(APIView):
    http_method_names = ['delete']
    permission_classes = [DeletePostPermission]

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(self.request, post)

        post.delete()
        return Response(status=status.HTTP_200_OK,
                        data={'post': {'id': pk}, 'status': 1})


class EditPostAPI(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.SinglePostSerializer
    permission_classes = [EditPostPermission]

    def get_object(self):
        queryset = self.get_queryset()
        post = get_object_or_404(queryset, pk=self.request.data.get('id', None))
        self.check_object_permissions(self.request, post)
        return post

    def perform_update(self, serializer):
        serializer.save(edited_at=timezone.now())

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({'post': response.data, 'status': 1})


class PostAPI(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.SinglePostSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'post_id'
