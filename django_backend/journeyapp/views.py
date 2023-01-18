from rest_framework import generics, renderers
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

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

    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     serializer = ThreadSerialier(queryset, many=True)
    #     return Response({
    #         'posts': serializer.data,
    #         'board': self.kwargs['board'],
    #         'threadId': self.kwargs['pk'],
    #     })


class CreateNewPostAPIView(generics.CreateAPIView):
    serializer_class = serializers.NewPostSerializer

    def perform_create(self, serializer):
        serializer.save(
            board=get_object_or_404(Board, link=self.request.data['board']),
            thread_id=self.request.data['threadId'])

# class DeletePostAPIView(generics.DestroyAPIView):
#     queryset = Post.objects.all()
#
#     def delete(self, request, *args, **kwargs):
#         print(kwargs)
#         return Response(status=status.HTTP_204_NO_CONTENT)
