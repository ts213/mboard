from django.core.exceptions import ValidationError
from django.db.models import Q
from rest_framework import serializers
from .models import Post, Board, Image
from .utils import make_thumb, process_post_text
from django.core.files.images import ImageFile


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('image', 'thumb')


class SinglePostSerializer(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.title')
    date = serializers.SerializerMethodField(method_name='get_date_timestamp')
    bump = serializers.SerializerMethodField(method_name='get_bump_timestamp')

    files = ImageSerializer(source='images', read_only=True, many=True)

    @staticmethod
    def get_date_timestamp(thread: Post):
        return thread.date.timestamp()

    @staticmethod
    def get_bump_timestamp(thread: Post):
        return thread.bump.timestamp()

    class Meta:
        model = Post
        # fields = ('id', 'board', 'text', 'poster', 'file', 'thumb', 'thread', 'date', 'bump')
        fields = ('id', 'board', 'text', 'poster', 'thread', 'date', 'bump', 'files')


class ThreadListSerializer(SinglePostSerializer):
    replies = serializers.SerializerMethodField()  # stackoverflow.com/questions/64867785

    @staticmethod
    def get_replies(post: Post):
        posts = post.post_set.order_by('-date')[:4][::-1]
        return SinglePostSerializer(posts, many=True).data

    class Meta(SinglePostSerializer.Meta):
        fields = SinglePostSerializer.Meta.fields + ('replies',)


class ThreadSerialier(SinglePostSerializer):
    posts = serializers.SerializerMethodField(method_name='get_posts')
    # threadId = serializers.IntegerField(source='pk')

    @staticmethod
    def get_posts(thread: Post):
        posts = Post.objects.filter(
            Q(pk=thread.pk) |
            Q(thread__pk=thread.pk)
        )
        s = SinglePostSerializer(posts, many=True).data
        return s

    class Meta(SinglePostSerializer.Meta):
        fields = ('id', 'board', 'posts')


class NewPostSerializer(serializers.ModelSerializer):
    # board = serializers.ReadOnlyField(source='board.title')
    board = serializers.SlugRelatedField(slug_field='link', queryset=Board.objects.all())
    file = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    def create(self, validated_data):
        files = validated_data.pop('file', None)
        post = Post.objects.create(**validated_data)
        if files:
            images = [Image(post=post,
                            image=image, thumb=make_thumb(image))
                      for image in files]
            Image.objects.bulk_create(images)

        return post

    # @staticmethod
    # def validate_file(obj):
    #     if obj.size > 1_000_000:  # 1 MB
    #         raise ValidationError('file too large')
    #     return obj

    class Meta:
        model = Post
        fields = '__all__'
        # exclude = ['board']


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'
