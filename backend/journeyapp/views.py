import time
from rest_framework import generics, renderers, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Board, Post
from . import serializers
from django.shortcuts import get_object_or_404


class ThreadsListAPIView(generics.ListAPIView):
    queryset = Post.objects.select_related('board').prefetch_related('images')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(board__link=self.kwargs.get('board', None))
        serializer = serializers.ThreadListSerializer(queryset, many=True)
        return Response({
            'threads': serializer.data,
            'board': self.kwargs['board']
        })


class BoardsAPIView(generics.ListAPIView):
    queryset = Board.objects.all()
    serializer_class = serializers.BoardSerializer


class SingleThreadAPIView(generics.RetrieveAPIView):
    renderer_classes = [renderers.JSONRenderer]
    serializer_class = serializers.ThreadSerialier

    def get_queryset(self):
        board = get_object_or_404(Board, link=self.kwargs['board'])
        thread_qset = board.post_set.filter(pk=self.kwargs['pk'])
        if not thread_qset:
            raise NotFound()
        return thread_qset


class CreateNewPostAPIView(generics.CreateAPIView):
    serializer_class = serializers.NewPostSerializer

    def post(self, request, *args, **kwargs):
        if thread_id := self.request.data.get('thread', None):
            post_is_thread = get_object_or_404(Post, pk=thread_id).is_thread()
            if not post_is_thread:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeletePostAPIView(APIView):
    http_method_names = ['delete']

    def delete(self, request, pk):
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
