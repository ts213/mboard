from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import *


class PostTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        pass
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

