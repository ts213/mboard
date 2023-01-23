from io import BytesIO
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db.models import Q
from rest_framework import serializers
from .models import Post, Board
from django.utils.html import escape
import re
from PIL import Image


class ThreadsSerializer(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.title')
    replies = serializers.SerializerMethodField()  # stackoverflow.com/questions/64867785

    def get_replies(self, obj):  # replies field -> get_replies method
        posts = obj.post_set.order_by('-date')[:4][::-1]
        return self.PostSerializer(posts, many=True).data

    class Meta:
        model = Post
        fields = '__all__'

    class PostSerializer(serializers.ModelSerializer):
        board = serializers.ReadOnlyField(source='board.title')

        class Meta:
            model = Post
            fields = '__all__'


class BoardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Board
        fields = '__all__'


class ThreadSerialier(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.title')
    posts = serializers.SerializerMethodField(method_name='get_posts')
    threadId = serializers.IntegerField(source='pk')

    def get_posts(self, thread: Post):
        posts = Post.objects.filter(
            Q(pk=thread.pk) |
            Q(thread__pk=thread.pk)
        )
        return self.PostsSerializer(posts, many=True).data

    class PostsSerializer(serializers.ModelSerializer):
        board = serializers.ReadOnlyField(source='board.title')

        class Meta:
            model = Post
            fields = '__all__'

    @staticmethod
    def validate_file(obj):
        if obj.size > 1_000_000:  # 1 mb
            raise ValidationError('file too large')
        return obj

    class Meta:
        model = Post
        fields = ('threadId', 'board', 'date', 'bump', 'posts')


class NewPostSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        validated_data['text'] = escape(validated_data['text'])
        validated_data['text'] = wrap_quoted_text_in_tag(validated_data['text'])
        validated_data['text'] = add_link(validated_data['text'])
        if 'file' in validated_data:
            validated_data['thumb'] = make_thumbnail(validated_data['file'])
        return Post.objects.create(**validated_data)

    class Meta:
        model = Post
        exclude = ['board']


def wrap_quoted_text_in_tag(post_text: str):
    def callback(match_obj):
        span = '<span style="color:red">{repl}</span>'
        return span.format(repl=match_obj.group(0).strip())
    post_text = re.sub('^\\s*::.+(?m)', callback, post_text)
    return post_text


def add_link(post_text: str):
    def callback(match_obj):
        print(match_obj.group(0))
        span = '<a class="quote-link" href="#pid-{link}">{repl}</a>'
        return span.format(repl=match_obj.group(0).strip(),
                           link=match_obj.group(0).strip('gt;&gt;'))
    post_text = re.sub('^\\s*&gt;&gt;[0-9]+(?m)', callback, post_text)
    return post_text


def make_thumbnail(inmemory_image):
    image = Image.open(inmemory_image)
    image.thumbnail(size=(200, 220))
    output = BytesIO()
    image.save(output, quality=85, format=image.format)
    output.seek(0)
    thumb = ContentFile(output.read(), name='thumb_' + inmemory_image.name)
    return thumb
