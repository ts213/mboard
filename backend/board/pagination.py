from rest_framework import pagination
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param, remove_query_param


class ThreadListPagination(pagination.PageNumberPagination):
    page_size = 7

    def get_paginated_response(self, data):
        return Response({
            'board': self.request.kwargs['board'],
            'nextPage': self.get_next_link(),
            'previousPage': self.get_previous_link(),
            'pageNum': self.page.number,
            'threads': data,
        })

    def get_next_link(self):  # relative urls
        if not self.page.has_next():
            return None
        url = self.request.get_full_path()
        page_number = self.page.next_page_number()
        return replace_query_param(url, self.page_query_param, page_number)

    def get_previous_link(self):  # relative urls
        if not self.page.has_previous():
            return None
        url = self.request.get_full_path()
        page_number = self.page.previous_page_number()
        if page_number == 1:
            return remove_query_param(url, self.page_query_param)
        return replace_query_param(url, self.page_query_param, page_number)


class SingleThreadPagination(pagination.LimitOffsetPagination):
    default_limit = 5
    # max_limit = 3

    def get_paginated_response(self, data):
        return Response({
            'board': self.request.kwargs['board'],
            'repliesCount': self.count,
            # 'threads': [data],
            'thread': data,
        })

    def get_next_link(self):  # relative urls
        if self.offset + self.limit >= self.count:
            return None

        url = self.request.get_full_path()
        # url = replace_query_param(url, self.limit_query_param, self.limit)  # url without ?limit=...

        offset = self.offset + self.limit
        return replace_query_param(url, self.offset_query_param, offset)

    def get_previous_link(self):  # relative urls
        if self.offset <= 0:
            return None

        url = self.request.get_full_path()
        url = replace_query_param(url, self.limit_query_param, self.limit)

        if self.offset - self.limit <= 0:
            return remove_query_param(url, self.offset_query_param)

        offset = self.offset - self.limit
        return replace_query_param(url, self.offset_query_param, offset)
