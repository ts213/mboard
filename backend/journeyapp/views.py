import time
from django.db.models import Prefetch
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Board, Post
from . import serializers
from django.shortcuts import get_object_or_404
# from django.db import connection, reset_queries


class ThreadsListAPIView(generics.ListAPIView):
    queryset = Post.objects.select_related('board').prefetch_related('images')

    def list(self, request, *args, **kwargs):
        threads = self.get_queryset().filter(
            board__link=self.kwargs.get('board', None), thread__isnull=True
        )
        threads_replies = Post.objects.filter(thread__in=threads)[:4] \
            .prefetch_related('images').select_related('board')

        threads_w_replies = threads.prefetch_related(
            Prefetch(lookup='posts',
                     queryset=threads_replies,  # queryset for lookup (override Django query)
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
    # queryset = Post.objects.all()
    lookup_url_kwarg = 'thread_id'

    def get_queryset(self):
        return Post.objects.filter(board__link=self.kwargs['board'])

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
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
            return Response(status=status.HTTP_201_CREATED, data={'status': 1})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeletePostAPIView(APIView):
    http_method_names = ['delete']

    @staticmethod
    def delete(request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatchPostAPIView(APIView):
    http_method_names = ['patch']

    def patch(self, request, pk):
        time.sleep(2)
        post = get_object_or_404(Post, pk=pk)
        post.text = self.request.data['text']
        post.save()
        return Response(status=status.HTTP_200_OK)
