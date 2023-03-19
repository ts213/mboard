from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Board
from . import serializers
from .permissions import *


class ThreadsListAPIView(generics.ListAPIView):
    def list(self, request, *args, **kwargs):
        board = get_object_or_404(Board, link=self.kwargs.get('board', None))
        threads_queryset = Post.objects \
            .select_related('board').prefetch_related('images') \
            .filter(board=board, thread__isnull=True)

        thread_replies = Post.objects \
                             .select_related('board').prefetch_related('images') \
                             .filter(thread__in=threads_queryset
                                     )[:4]

        threads_w_replies = threads_queryset.prefetch_related(
            Prefetch(lookup='posts',
                     queryset=thread_replies,  # queryset for lookup (override Django query)
                     to_attr='replies')
        )
        serializer = serializers.ThreadListSerializer(threads_w_replies, many=True)  # context={'request': request}
        return Response({
            'threads': serializer.data,
            'board': self.kwargs['board']
        })


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
            'threads': [serializer.data],
            'board': self.kwargs['board'],
            'id': self.kwargs['thread_id']
        })


class CreateNewPostAPIView(generics.CreateAPIView):
    serializer_class = serializers.NewPostSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED, data={'status': 1, 'post': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeletePostAPIView(APIView):
    http_method_names = ['delete']
    permission_classes = [DeletePostPermission]

    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        self.check_object_permissions(self.request, post)

        post.delete()
        return Response(status=status.HTTP_200_OK,
                        data={'post': {'id': pk},
                              'status': 1})


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
        return {'post': response, 'status': 1}
