import time

from rest_framework import generics, renderers, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Board, Post
from . import serializers
from django.shortcuts import get_object_or_404


class ThreadsListAPIView(generics.ListAPIView):
    renderer_classes = [renderers.JSONRenderer]

    # queryset = Post.objects.filter(thread__isnull=True)
    # serializer_class = serializers.ThreadsSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = serializers.ThreadsSerializer(queryset, many=True)
        return Response({
            'threads': serializer.data,
            'board': self.kwargs['board']
        })

    def get_queryset(self):
        board = get_object_or_404(Board, link=self.kwargs['board'])
        return board.post_set.filter(thread__isnull=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': None})  # to use img relative URLs instead of absolute
        # threads = board.post_set.filter(thread__isnull=True).order_by('-bump')
        # threads_dict = {thread: thread.post_set.order_by('-date')[:4][::-1] for thread in threads}
        return context


class BoardsAPIView(generics.ListAPIView):
    renderer_classes = [renderers.JSONRenderer]
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

    def perform_create(self, serializer):
        serializer.save(
            board=get_object_or_404(Board, link=self.request.data['board']),
            thread_id=self.request.data['threadId'])


class DeletePostAPIView(APIView):
    http_method_names = ['delete']

    def delete(self, request, pk):
        print('delettt!!')
        post = get_object_or_404(Post, pk=pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatchPostAPIView(APIView):
    import time
    http_method_names = ['patch']

    def patch(self, request, pk):
        time.sleep(3)
        post = get_object_or_404(Post, pk=pk)
        post.text = self.request.data['text']
        print(self.request.data['text'])
        post.save()
        return Response(status=status.HTTP_200_OK)
