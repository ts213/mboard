import time

from rest_framework import generics, renderers, status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Board, Post
from . import serializers
from django.shortcuts import get_object_or_404


class ThreadsListAPIView(generics.ListAPIView):
    # queryset = Post.objects.filter(thread__isnull=True)
    # serializer_class = serializers.ThreadsSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = serializers.ThreadListSerializer(queryset, many=True)
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
        for file in self.request.data['file']:
            print(file)

        self.thread_id = self.request.data.get('threadId')  # noqa, value comes in as str noqa
        if not self.thread_id.isdigit():  # isn't empty and convertible to int
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            self.board = get_object_or_404(Board, link=self.request.data['board'])  # noqa
            assert (self.thread_id == '0' or  # order of 'or' matters
                    get_object_or_404(Post, pk=self.thread_id).is_thread())
        except (Board.DoesNotExist, AssertionError, Exception):
            return Response(status=status.HTTP_404_NOT_FOUND)
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(board=self.board, thread_id=self.thread_id)


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
