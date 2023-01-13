from rest_framework import serializers
from .models import Post, Board
from django.shortcuts import get_object_or_404
from django.utils.html import escape
import re


class ThreadsSerializer(serializers.ModelSerializer):
    board = serializers.ReadOnlyField(source='board.title')
    replies = serializers.SerializerMethodField()

    def get_replies(self, obj):
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

    def create(self, validated_data):
        validated_data['text'] = escape(validated_data['text'])
        validated_data['text'] = wrap_quoted_text_in_tag(validated_data['text'])
        validated_data['text'] = add_link(validated_data['text'])
        board_link = validated_data.pop('board_link')
        board = get_object_or_404(Board, link=board_link)
        return Post.objects.create(board=board, **validated_data)

    class Meta:
        model = Post
        fields = '__all__'


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
