from django.core.exceptions import ValidationError
from django.db.models import Q
from rest_framework import serializers
from .models import Post, Board, Image
from .utils import make_thumb, process_post_text
from django.core.files.images import ImageFile


class SinglePostSerializer(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.title')
    date = serializers.SerializerMethodField(method_name='get_date_timestamp')
    bump = serializers.SerializerMethodField(method_name='get_bump_timestamp')

    @staticmethod
    def get_date_timestamp(thread: Post):
        return thread.date.timestamp()

    @staticmethod
    def get_bump_timestamp(thread: Post):
        return thread.bump.timestamp()

    class Meta:
        model = Post
        # fields = ('id', 'board', 'text', 'poster', 'file', 'thumb', 'thread', 'date', 'bump')
        fields = ('id', 'board', 'text', 'poster', 'thread', 'date', 'bump')


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
        return SinglePostSerializer(posts, many=True).data

    class Meta(SinglePostSerializer.Meta):
        fields = ('id', 'board', 'posts')


class NewPostSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        if validated_data.get('thread_id') == '0':  # 0 == new thread, saving new thread's thread_id as None
            validated_data.pop('thread_id')

        validated_data['text'] = process_post_text(validated_data['text'])

        post = Post.objects.create(**validated_data)
        print(self.context)

        # if self.context.get('file', None):
        #     images = [Image(post=post, image=image, thumb=make_thumb(image))
        #               for image in self.context['file']]
        #     Image.objects.bulk_create(images)
        # image = self.context['file']

        image = self.context['file'][0]
        print(type(image))
        # im = ImageFile(image)
        # files = [file for file in self.context['file']]
        # image.file.seek(0)
        data = {
            'post': post.pk,
            'image': image,
            'thumb': make_thumb(image)
        }
        s = ImageSerializer(data=data)
        er = s.is_valid()

        return post

    @staticmethod
    def validate_file(obj):
        if obj.size > 1_000_000:  # 1 MB
            raise ValidationError('file too large')
        return obj

    class Meta:
        model = Post
        exclude = ['board']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('post', 'image')


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'
