from rest_framework import pagination
from rest_framework.response import Response


class ThreadListPagination(pagination.PageNumberPagination):
    page_size = 7

    def get_paginated_response(self, data):
        return Response({
            'board': self.request.kwargs['board'],
            'previous': self.get_previous_link(),
            'next': self.get_next_link(),
            'page': self.request.query_params.get('page', 1),
            'threads': data,
        })


class SingleThreadPagination(pagination.PageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        return Response({
            'board': self.request.kwargs['board'],
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'threads': [data],
        })
