from django.urls import reverse
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APITestCase
from django.test import Client
from django.test.client import RequestFactory
from utils import check_if_banned, ban_user
from .models import *


class PostTestCase(APITestCase):
    def tearDown(self) -> None:
        cache.clear()

    @classmethod
    def setUpTestData(cls):
        cls.client = Client()
        cls.factory = RequestFactory()

        cls.board_with_janny1 = Board.objects.create(link='b', title='b')
        cls.board_with_janny2 = Board.objects.create(link='g', title='g')

        cls.janny1 = User.objects.create()
        cls.janny1.boards.add(cls.board_with_janny1)

        cls.user1 = User.objects.create()
        cls.user2 = User.objects.create()

        cls.user1_thread1 = Post.objects.create(text='test',
                                                user=cls.user1,
                                                board=cls.board_with_janny1)

        cls.user2_thread2 = Post.objects.create(text='test',
                                                user=cls.user1,
                                                board=cls.board_with_janny2)

        cls.user1_post = Post.objects.create(text='test',
                                             user=cls.user1,
                                             thread=cls.user1_thread1,
                                             board=cls.board_with_janny1)

        cls.user2_post = Post.objects.create(text='test',
                                             user=cls.user2,
                                             thread=cls.user2_thread2,
                                             board=cls.board_with_janny2)

    def test_no_id_no_delete(self):
        url = reverse('post', kwargs={'post_id': self.user1_post.pk})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_NOT_delete_thread(self):
        url = reverse('post', kwargs={'post_id': self.user1_thread1.pk})
        response = self.client.delete(url, headers={'User-Id': self.user1.uuid})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_janny_CAN_delete_thread_from_his_board(self):
        url = reverse('post', kwargs={'post_id': self.user1_thread1.pk})
        response = self.client.delete(url, headers={'User-Id': self.janny1.uuid})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_janny_can_NOT_delete_thread_from_other_board(self):
        url = reverse('post', kwargs={'post_id': self.user2_thread2.pk})
        response = self.client.delete(url, headers={'User-Id': self.janny1.uuid})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_his_post(self):
        url = reverse('post', kwargs={'post_id': self.user1_post.pk})
        response = self.client.delete(url, headers={'User-Id': self.user1.uuid})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_NOT_delete_NOT_his_post(self):
        url = reverse('post', kwargs={'post_id': self.user2_post.pk})
        response = self.client.delete(url, headers={'User-Id': self.user1.uuid})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_janny_can_delete_post(self):
        url = reverse('post', kwargs={'post_id': self.user1_post.pk})
        response = self.client.delete(url, headers={'User-Id': self.janny1.uuid})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_janny_can_NOT_delete_post_from_other_board(self):
        url = reverse('post', kwargs={'post_id': self.user2_post.pk})
        response = self.client.delete(url, headers={'User-Id': self.janny1.uuid})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_cache_works(self):
        cache.set('key', 'value123', timeout=555)
        key = cache.get('key')
        ttl = cache.ttl('key')
        self.assertEqual('value123', key)
        self.assertEqual(555, ttl)

    def test_ban_works(self):
        ip = '192.168.1.134'
        cache.set('ban' + ':' + ip + ':' + self.user1_post.board.link,
                  1,
                  timeout=300)

        request = self.factory.get('testurl')
        request.META['REMOTE_ADDR'] = ip
        self.assertTrue(check_if_banned(request, self.user1_post.board.link))

        another_ip = ip.replace('4', '9')
        request.META['REMOTE_ADDR'] = another_ip
        self.assertFalse(check_if_banned(request, self.user1_post.board.link))

    def test_janny_can_ban_or_cannot_ban(self):
        request = self.factory.get('testurl?ban=10', headers={'User-Id': self.janny1.uuid})
        request.query_params = {'ban': '10'}  # https://github.com/encode/django-rest-framework/issues/6488
        self.assertTrue(ban_user(request, self.user1_post))
        self.assertFalse(ban_user(request, self.user2_post))
