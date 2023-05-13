from datetime import timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework.test import APIClient
from django.test.client import RequestFactory
from utils import ban_user
from .models import *


class PostTestCase(APITestCase):
    def tearDown(self) -> None:
        cache.clear()

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
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
                                                user=cls.user2,
                                                board=cls.board_with_janny2)

        cls.user1_post = Post.objects.create(text='test',
                                             user=cls.user1,
                                             thread=cls.user1_thread1,
                                             board=cls.board_with_janny1)

        cls.user1_old_post = Post.objects.create(text='test',
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

    def test_user_can_NOT_delete_hist_post_after_n_time(self):
        date = timezone.now() - timedelta(days=2)
        self.user1_old_post.date = date
        self.user1_old_post.save(update_fields=['date'])

        url = reverse('post', kwargs={'post_id': self.user1_old_post.pk})
        response = self.client.delete(url, headers={'User-Id': self.user1.uuid})

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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
        board_banned_on = self.user1_thread1.board.link
        cache.set('ban' + ':' + ip + ':' + board_banned_on,
                  1,
                  timeout=300)
        url = reverse('thread', kwargs={'board': board_banned_on, 'thread_id': '0'})
        data = {'text': 'post123', 'board': board_banned_on}
        response = self.client.post(path=url, data=data, REMOTE_ADDR=ip)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        another_ip = ip.replace('4', '9')
        response = self.client.post(path=url, data=data, REMOTE_ADDR=another_ip)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_janny_can_ban_or_cannot_ban(self):
        request = self.factory.get('testurl?ban=10', headers={'User-Id': self.janny1.uuid})
        request.query_params = {'ban': '10'}  # https://github.com/encode/django-rest-framework/issues/6488
        self.assertTrue(ban_user(request, self.user1_post))
        self.assertFalse(ban_user(request, self.user2_post))

    def test_can_or_cannot_edit_post(self):
        url = reverse('post', kwargs={'post_id': self.user1_post.pk})
        data = {'text': 'edited', 'id': self.user1_post.pk}
        headers = {'User-id': self.user1.uuid}
        response = self.client.patch(path=url, headers=headers, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # can only edit once
        response = self.client.patch(path=url, headers=headers, data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # can't edit other's
        url = reverse('post', kwargs={'post_id': self.user2_post.pk})
        data = {'text': 'edited', 'id': self.user2_post.pk}
        response = self.client.patch(path=url, headers=headers, data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # janny can't
        headers = {'User-id': self.janny1.uuid}
        response = self.client.patch(path=url, headers=headers, data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
