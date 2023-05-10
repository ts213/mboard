import re
from rest_framework import serializers
from django.db import transaction
from .models import Post, User, Board, Image
from .utils import make_thumb, CoercingUUIDField


class ImageSerializer(serializers.ModelSerializer):
    width = serializers.SerializerMethodField(method_name='get_width')
    height = serializers.SerializerMethodField(method_name='get_height')

    @staticmethod
    def get_width(instance):
        return instance.image.width

    @staticmethod
    def get_height(instance):
        return instance.image.height

    class Meta:
        model = Image
        fields = ('image', 'thumb', 'width', 'height')


class SinglePostSerializer(serializers.ModelSerializer):
    user_id = CoercingUUIDField(required=False, write_only=True)
    date = serializers.SerializerMethodField(method_name='get_date_timestamp')
    bump = serializers.SerializerMethodField(method_name='get_bump_timestamp')
    images = ImageSerializer(read_only=True, many=True)
    images_write = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    class Meta:
        model = Post
        exclude = ('edited_at', 'user')

    def create(self, validated_data):
        images = validated_data.pop('images_write', None)
        user_id = validated_data.pop('user_id', None)
        try:
            with transaction.atomic():
                user, created = User.objects.get_or_create(uuid=user_id)  # save() handles None
                validated_data['user'] = user

                post = Post.objects.create(**validated_data)
                if created:
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
            raise serializers.ValidationError('Error creating post')

    def validate(self, data):
        images = data.get('images_write', None)
        text = data.setdefault('text', '')
        post_message_length = len(text)

        if post_message_length == 0 and not images:
            raise serializers.ValidationError(
                {'text': 'This field is required'},
                {'images': 'This field is required'},
            )
        return data

    @staticmethod
    def validate_images(files):
        total_file_size = sum([file.size for file in files])
        if total_file_size > 1_000_000:
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

    @staticmethod
    def get_bump_timestamp(thread: Post):
        return thread.bump.timestamp()


class ThreadListSerializer(SinglePostSerializer):
    replies = serializers.ListField(child=SinglePostSerializer())

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
        fields = '__all__'
        read_only_fields = ('userboard',)

    @staticmethod
    def validate_title(title):  # add spaces TODO
        if re.fullmatch('^[A-Za-zА-Яа-яЁё]+[0-9]*$', title):  # latin/cyrillic followed by digits
            return title
        raise serializers.ValidationError('Incorrect title')

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
                boards = user.boards.values_list('link', flat=True)
                board.boards = boards

                if created:
                    self.fields['user_id'].write_only = False
                    board.user_id = user.uuid
                return board
            except Exception as e:
                print(e)
                raise serializers.ValidationError('error')
