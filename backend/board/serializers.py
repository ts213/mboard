from rest_framework import serializers
import uuid
from django.core.exceptions import ValidationError
from .models import Post, Board, Image
from .utils import make_thumb, process_post_text


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
    date = serializers.SerializerMethodField(method_name='get_date_timestamp')
    bump = serializers.SerializerMethodField(method_name='get_bump_timestamp')
    images = ImageSerializer(read_only=True, many=True)
    images_write = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    class Meta:
        model = Post
        exclude = ('edited_at',)
        extra_kwargs = {'userid': {'write_only': True}}

    def create(self, validated_data):
        if not validated_data.get('userid', None):
            validated_data['userid'] = uuid.uuid4()
            self.fields['userid'].write_only = False

        images = validated_data.pop('images_write', None)
        validated_data['text'] = process_post_text(validated_data['text'])
        post = Post.objects.create(**validated_data)
        if images:
            images = [Image(post=post,
                            image=image, thumb=make_thumb(image))
                      for image in images]
            Image.objects.bulk_create(images)

        return post

    def validate(self, data):
        images = data.get('images', None)
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
            raise ValidationError('Max size of files exceeded')
        return files

    @staticmethod
    def validate_thread(thread):
        if thread.thread:  # posts can't have other posts as their thread
            raise ValidationError("Thread doesn't exist")
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
    class Meta:
        model = Board
        fields = '__all__'
