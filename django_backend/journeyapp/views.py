from rest_framework import generics, renderers, status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Board
from .serializers import BoardSerializer, ThreadsSerializer, ThreadSerialier
from django.shortcuts import get_object_or_404
from django.db.models import Q


class ThreadsAPIView(generics.ListAPIView):
    renderer_classes = [renderers.JSONRenderer]
    # queryset = Post.objects.filter(thread__isnull=True)
    serializer_class = ThreadsSerializer

    def get_queryset(self):
        board = get_object_or_404(Board, link=self.kwargs['board'])
        return board.post_set.filter(thread__isnull=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        # context.update({'thumb': self.request.user})  # ?? ne pomnu...
        context.update({'request': None})  # to use img relative URLs instead of absolute
        #
        # threads = board.post_set.filter(thread__isnull=True).order_by('-bump')
        # threads_dict = {thread: thread.post_set.order_by('-date')[:4][::-1] for thread in threads}
        return context
    #
    # @cached_property
    # def get_board(self):
    #     return get_object_or_404(Board, link=self.kwargs['board'])


class BoardsAPIView(generics.ListAPIView):
    renderer_classes = [renderers.JSONRenderer]
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class SingleThreadAPIView(generics.ListCreateAPIView):
    renderer_classes = [renderers.JSONRenderer]
    serializer_class = ThreadSerialier

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(board_link=self.request.data['board'],
                        thread_id=self.request.data['threadId'])

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ThreadSerialier(queryset, many=True)
        return Response({
            'posts': serializer.data,
            'board': self.kwargs['board'],
            'threadId': self.kwargs['id'],
        })

    def get_queryset(self):
        board = get_object_or_404(Board, link=self.kwargs['board'])
        posts_queryset = board.post_set.filter(
            Q(pk=self.kwargs['id']) |
            Q(thread__pk=self.kwargs['id'])
        )
        if not posts_queryset:
            raise NotFound()
        return posts_queryset

    # def get_serializer_context(self):  # to use img relative URLs instead of absolute
    #     context = super().get_serializer_context()
    #     context.update({'thumb': self.request.user})
    #     context.update({'request': None})
    #     return context

    # def list(self, request, *args, **kwargs):
    #     response = super().list(request, args, kwargs)
    #     response.data.append(('dadsadd', '11111111111111'))
    #     return response
