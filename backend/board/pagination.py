from rest_framework import pagination
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param, remove_query_param
from djangoconf.settings import env


class ThreadListPagination(pagination.PageNumberPagination):
    page_size = int(env.get('THREADS_PER_PAGE'))

    def get_paginated_response(self, data):
        return Response({
            'board': self.request.kwargs['board'],
            'pageNum': self.page.number,
            'nextPageNum': self.get_next_page_num(),
            'threads': data,
        })

    def get_next_page_num(self):
        if not self.page.has_next():
            return None
        page_number = self.page.next_page_number()
        return page_number


class SingleThreadPagination(pagination.LimitOffsetPagination):
    default_limit = int(env.get('VITE_REPLIES_PER_PAGE'))
    # max_limit = 3

    def get_paginated_response(self, data):
        return Response({
            'board': self.request.kwargs['board'],
            'repliesCount': self.count,
            # 'threads': [data],
            'thread': data,
        })

    def paginate_queryset(self, queryset, request, view=None):
        self.limit = self.get_limit(request)
        if self.limit is None:
            return None

        self.count = self.get_count(queryset)

        if self.count - self.limit < 9:  # loading all if isn't much left
            self.limit = self.count

        self.offset = self.get_offset(request)
        self.request = request
        if self.count > self.limit and self.template is not None:
            self.display_page_controls = True

        if self.count == 0 or self.offset > self.count:
            return []
        return list(queryset[self.offset:self.offset + self.limit])

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
