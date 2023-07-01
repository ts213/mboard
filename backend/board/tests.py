from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from .models import *


class PostTestCase(APITestCase):
    def tearDown(self) -> None:
        cache.clear()

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.factory = APIRequestFactory()

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

        cls.user2_post = Post.objects.create(text='test',
                                             user=cls.user2,
                                             thread=cls.user2_thread2,
                                             board=cls.board_with_janny2)

    def make_request(self, method, thread_id, board, user_id=None, data=None, **kwargs):
        params = {'board': board}
        if thread_id is not None:
            params['thread_id'] = thread_id

        url = reverse('thread', kwargs=params)
        match method:
            case 'get':
                return self.client.get(url)
            case 'post':
                return self.client.post(url, data, **kwargs)
            case 'patch':
                return self.client.patch(url, data, headers={'User-Id': user_id})
            case 'delete':
                return self.client.delete(url, headers={'User-Id': user_id})

    def test_no_id_no_delete(self):
        response = self.make_request('delete', self.user1_post.pk, self.user1_post.board)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_NOT_delete_thread(self):
        response = self.make_request('delete', self.user1_thread1.pk, self.user1_thread1.board)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_janny_CAN_delete_thread_from_his_board(self):
        response = self.make_request('delete', self.user1_thread1.pk, self.user1_thread1.board, self.janny1.get_uuid())
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_janny_can_NOT_delete_thread_from_other_board(self):
        response = self.make_request('delete', self.user2_thread2.pk, self.user2_thread2.board, self.janny1.get_uuid())
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_his_post(self):
        response = self.make_request('delete', self.user1_post.pk, self.user1_post.board, self.user1.get_uuid())
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_NOT_delete_hist_post_after_n_time(self):
        date = timezone.now() - timedelta(days=2)
        self.user1_post.date = date
        self.user1_post.save(update_fields=['date'])
        response = self.make_request('delete', self.user1_post.pk, self.user1_post.board, self.user1.get_uuid())
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_NOT_delete_NOT_his_post(self):
        response = self.make_request('delete', self.user2_post.pk, self.user2_post.board, self.user1.get_uuid())
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_janny_can_delete_post(self):
        response = self.make_request('delete', self.user1_post.pk, self.user1_post.board, self.janny1.get_uuid())
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_janny_can_NOT_delete_post_from_other_board(self):
        response = self.make_request('delete', self.user2_post.pk, self.user2_post.board, self.janny1.get_uuid())
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
        response = self.make_request('post', '0', board_banned_on, data={'text': 'post123', 'board': board_banned_on},
                                     REMOTE_ADDR=ip)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_janny_can_ban_or_cannot_ban(self):
    #     request = self.factory.get('testurl?ban=10', headers={'User-Id': self.janny1.get_uuid()})
    #     request.query_params = {'ban': '10'}  # https://github.com/encode/django-rest-framework/issues/6488
    #     self.assertTrue(ban_user(request, self.user1_post))
    #     self.assertFalse(ban_user(request, self.user2_post))

    def test_can_or_cannot_edit_post(self):
        response = self.make_request('patch', self.user1_post.pk, self.user1_post.board, self.user1.get_uuid(),
                                     data={'text': 'edited', 'type': 'edit'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # can edit only once
        response = self.make_request('patch', self.user1_post.pk, self.user1_post.board, self.user1.get_uuid(),
                                     data={'text': 'edited', 'type': 'edit'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # can't edit other's
        response = self.make_request('patch', self.user2_post.pk, self.user2_post.board, self.user1.get_uuid(),
                                     data={'text': 'editedddd', 'type': 'edit'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # janny can't
        response = self.make_request('patch', self.user2_post.pk, self.user2_post.board, self.janny1.get_uuid(),
                                     data={'text': 'edited', 'type': 'edit'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_thread_closing(self):
        data = {'text': 'post123', 'board': self.user1_thread1.board, 'thread': self.user1_thread1.pk, 'type': 'close'}
        # user
        response = self.make_request('patch', self.user1_thread1.pk, self.user1_thread1.board, self.user1.get_uuid(), data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # janny
        response = self.make_request('patch', self.user1_thread1.pk, self.user1_thread1.board, self.janny1.get_uuid(), data=data)
        self.assertEqual(response.data['post']['closed'], True)

        # janny other board
        response = self.make_request('patch', self.user2_thread2.pk, self.user2_thread2.board, self.janny1.get_uuid(), data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_not_post_if_thread_closed(self):
        data = {'text': 'post123', 'board': self.user1_thread1.board, 'thread': self.user1_thread1.pk}
        response = self.make_request('post', self.user1_thread1.pk, self.user1_thread1.board, self.janny1.get_uuid(), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.user1_thread1.closed = True
        self.user1_thread1.save(update_fields=['closed'])
        response = self.make_request('post', self.user1_thread1.pk, self.user1_thread1.board, self.janny1.get_uuid(), data=data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
