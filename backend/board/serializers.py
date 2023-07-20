import re
from rest_framework import serializers
from django.db import transaction
from .models import Post, User, Board, Image
from .utils import make_thumb, CoercingUUIDField
from djangoconf.settings import env

FORBIDDEN_BOARDS = ['all', 'overboard', 'admin']
UPLOAD_LIMIT = int(env.get('VITE_FILESIZE_UPLOAD_LIMIT'))


class ImageSerializer(serializers.ModelSerializer):
    width = serializers.SerializerMethodField(method_name='get_width')
    height = serializers.SerializerMethodField(method_name='get_height')

    @staticmethod
    def get_width(instance):
        try:
            return instance.image.width
        except FileNotFoundError:
            return 0

    @staticmethod
    def get_height(instance):
        try:
            return instance.image.height
        except FileNotFoundError:
            return 0

    class Meta:
        model = Image
        fields = ('image', 'thumb', 'width', 'height')


class SinglePostSerializer(serializers.ModelSerializer):
    user_id = CoercingUUIDField(required=False, write_only=True)
    date = serializers.SerializerMethodField(method_name='get_date_timestamp')
    images = ImageSerializer(read_only=True, many=True)
    images_write = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    thread = serializers.PrimaryKeyRelatedField(allow_null=True, required=False,
                                                queryset=Post.objects.filter(closed=False))

    class Meta:
        model = Post
        exclude = ('edited_at', 'user', 'bump')

    def create(self, validated_data):
        images = validated_data.pop('images_write', None)
        user_id = validated_data.pop('user_id', None)
        try:
            with transaction.atomic():
                user, user_created = User.objects.get_or_create(uuid=user_id)  # save() handles None
                validated_data['user'] = user

                post = Post.objects.create(**validated_data)
                if user_created:
                    self.fields['user_id'].write_only = False
                    post.user_id = user.uuid

                if images:
                    images = [Image(post=post,
                                    image=image, thumb=make_thumb(image))
                              for image in images]
                    Image.objects.bulk_create(images)

                return post
        except Exception as e:
            print(e)
            raise serializers.ValidationError({'detail': 'Error creating a new post'})

    def validate(self, data):
        method = self.context.get('method')
        if method == 'POST':
            images = data.get('images_write')
            thread = data.get('thread')
            text = data.get('text')
            if not images and not thread:
                raise serializers.ValidationError({'detail': 'Image is required'}, )

            if not text and not images:
                raise serializers.ValidationError(
                    {'detail': 'Message or image is required'},
                )
        return data

    @staticmethod
    def validate_board(board):
        if board.closed:
            raise serializers.ValidationError('board is closed')
        return board

    @staticmethod
    def validate_images_write(files):
        total_file_size = sum([file.size for file in files])
        if total_file_size > UPLOAD_LIMIT:
            raise serializers.ValidationError('Max size of files exceeded')
        return files

    @staticmethod
    def validate_thread(thread):
        if thread.thread:  # posts can't have other posts as their thread
            raise serializers.ValidationError("Thread doesn't exist")
        return thread

    @staticmethod
    def get_date_timestamp(thread: Post):
        return thread.date.timestamp()


class CatalogSerializer(SinglePostSerializer):
    replies_count = serializers.SerializerMethodField(method_name='get_replies_count')
    images_write = None
    user_id = None

    @staticmethod
    def get_replies_count(instance):
        return instance.posts.count()

    class Meta(SinglePostSerializer.Meta):
        exclude = ('edited_at', 'user', 'bump')


class ThreadListSerializer(SinglePostSerializer):
    replies = serializers.ListField(child=SinglePostSerializer())
    replies_count = serializers.IntegerField()

    def to_representation(self, instance):
        with_replies_sorted = super().to_representation(instance)
        with_replies_sorted['replies'] = with_replies_sorted['replies'][::-1]  # can't [::-1] in ORM, doing it here
        return with_replies_sorted

    class Meta(SinglePostSerializer.Meta):
        exclude = SinglePostSerializer.Meta.exclude


class BoardSerializer(serializers.ModelSerializer):
    user_id = CoercingUUIDField(required=False, write_only=True)
    posts_count = serializers.IntegerField(required=False)
    posts_last24h = serializers.IntegerField(required=False)
    boards = serializers.ListField(required=False, help_text='boards a user has moderating perm. on')

    class Meta:
        model = Board
        exclude = ('closed',)
        read_only_fields = ('userboard',)

    def validate(self, data):
        title = data.get('title')
        link = data.get('link')
        not_allowed_board = next(
            (board for board in FORBIDDEN_BOARDS if board == title or board == link),
            None
        )
        if not_allowed_board:
            raise serializers.ValidationError({'detail': f'"{not_allowed_board}" is not allowed'})
        return data

    @staticmethod
    def validate_title(title):  # add spaces TODO
        if Board.objects.filter(title__iexact=title):
            raise serializers.ValidationError('Title already exists')
        if not re.fullmatch('^[A-Za-zА-Яа-яЁё]+[0-9]*$', title):  # latin/cyrillic followed by digits
            raise serializers.ValidationError('Incorrect title')
        return title

    @staticmethod
    def validate_link(link):
        if re.fullmatch('^[a-z]+[0-9]*$', link):  # latin followed by digits
            return link
        raise serializers.ValidationError('Incorrect link')

    def create(self, validated_data):
        with transaction.atomic():
            try:
                user_id = validated_data.pop('user_id', None)
                user, created = User.objects.get_or_create(uuid=user_id)

                board = Board.objects.create(**validated_data)  # save() handles None
                board.janny.add(user)
                boards = list(user.boards.values_list('link', flat=True))
                if user.global_janny:
                    boards.append('*')

                board.boards = boards

                if created:
                    self.fields['user_id'].write_only = False
                    board.user_id = user.uuid
                return board
            except Exception as e:
                print(e)
                raise serializers.ValidationError('error')
