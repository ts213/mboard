from django.core.exceptions import ValidationError
from django.db.models import Q
from rest_framework import serializers
from .models import Post, Board, Image
from .utils import make_thumb, process_post_text


class ImageSerializer(serializers.ModelSerializer):
    width = serializers.SerializerMethodField(method_name='get_width')
    height = serializers.SerializerMethodField(method_name='get_height')

    @staticmethod
    def get_width(inst):
        return inst.image.width

    @staticmethod
    def get_height(inst):
        return inst.image.height

    class Meta:
        model = Image
        fields = ('image', 'thumb', 'width', 'height')


class SinglePostSerializer(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.link')
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
        fields = ('id', 'board', 'text', 'poster', 'thread', 'date', 'bump', 'files')


class ThreadListSerializer(SinglePostSerializer):
    replies = serializers.ListField(child=SinglePostSerializer())

    class Meta(SinglePostSerializer.Meta):
        fields = SinglePostSerializer.Meta.fields + ('replies',)


class ThreadSerialier(SinglePostSerializer):
    posts = serializers.SerializerMethodField(method_name='get_posts')

    @staticmethod
    def get_posts(thread: Post):
        posts = Post.objects \
            .select_related('board') \
            .prefetch_related('images').filter(
                                        Q(pk=thread.pk) |
                                        Q(thread__pk=thread.pk)) \
                                       .order_by('date')
        return SinglePostSerializer(posts, many=True).data

    class Meta(SinglePostSerializer.Meta):
        fields = ('id', 'board', 'posts')


class NewPostSerializer(serializers.ModelSerializer):
    board = serializers.SlugRelatedField(slug_field='link', queryset=Board.objects.all())
    file = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    def create(self, validated_data):
        files = validated_data.pop('file', None)
        validated_data['text'] = process_post_text(validated_data['text'])
        post = Post.objects.create(**validated_data)
        if files:
            images = [Image(post=post,
                            image=image, thumb=make_thumb(image))
                      for image in files]
            Image.objects.bulk_create(images)
        return post

    @staticmethod
    def validate_file(files):
        total_file_size = sum([file.size for file in files])
        if total_file_size > 1_000_000:
            raise ValidationError('Max files size exceeded')
        return files

    @staticmethod
    def validate_thread(thread):
        if thread.thread:  # posts can't have other thread's posts as their thread
            raise ValidationError('Thread does not exist')
        return thread

    class Meta:
        model = Post
        fields = '__all__'


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'
