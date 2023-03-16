from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Board, Post
from . import serializers


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

    @staticmethod
    def delete(request, pk):
        post = get_object_or_404(Post, pk=pk)
        validated = validate_user(request, post)
        if not validated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PatchPostAPIView(APIView):
    http_method_names = ['patch']

    @staticmethod
    def patch(request, board, pk):
        post = get_object_or_404(Post, pk=pk)
        validated = validate_user(request, post, is_patch=True)
        if not validated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        data = request.data.copy()  # request.data immutable
        data.update({'board': board, 'edited_at': timezone.now()})
        serializer = serializers.NewPostSerializer(data=data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer.update(post, serializer.validated_data)
        return Response(status=status.HTTP_200_OK,
                        data={'edited': post.text, 'id': post.pk})


def validate_user(request, post: Post, is_patch=False):
    user_id = request.headers.get('userid', None)
    if not user_id or (user_id != str(post.userid)):
        return False
    if is_patch and post.edited_at is not None:  # already was edited
        return False
    return True
    # diff: timezone.timedelta = timezone.now() - post.edited_at
    # if is_patch and diff.seconds < 86_400:  # 1 day
