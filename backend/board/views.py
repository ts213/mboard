from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets, pagination
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Board
from . import serializers
from .permissions import *
from django.db import connection


class CustomPagination(pagination.PageNumberPagination):
    page_size = 7


class ThreadsListAPIView(generics.ListAPIView):
    serializer_class = serializers.ThreadListSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        self.board = get_object_or_404(Board, link=self.kwargs.get('board', None))  # noqa

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

        data['board'] = self.board.link
        data.move_to_end('results')  # just to satisfy OCD
        return Response(data)


class BoardsAPIView(generics.ListAPIView):
    queryset = Board.objects.all()
    serializer_class = serializers.BoardSerializer


class SingleThreadAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.ThreadSerialier
    lookup_url_kwarg = 'thread_id'

    def get_queryset(self):
        return Post.objects.filter(board=self.kwargs['board'])

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()  # lookup_field, defaults to 'pk'.
        serializer = serializers.ThreadSerialier(instance)
        return Response({
            'results': [serializer.data],
            'board': self.kwargs['board'],
            'id': self.kwargs['thread_id']
        })


class CreateNewPostAPIView(generics.CreateAPIView):
    serializer_class = serializers.NewPostSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_201_CREATED,
                        data={'status': 1, 'post': response.data})


class DeletePostAPIView(APIView):
    http_method_names = ['delete']
    permission_classes = [DeletePostPermission]

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(self.request, post)

        post.delete()
        return Response(status=status.HTTP_200_OK,
                        data={'post': {'id': pk}, 'status': 1})


class EditPostAPIView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = serializers.NewPostSerializer
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
