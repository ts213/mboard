from django.urls import path
from .views import *

urlpatterns = [
    path('api/boards/', BoardsAPI.as_view(), name='boards'),

    path('api/<str:board>/', ThreadListAPI.as_view(), name='board'),

    path('api/<str:board>/thread/<int:thread_id>/', ThreadAPI.as_view(), name='thread'),

    path('api/post/<int:post_id>/', PostAPI.as_view(), name='post'),
]
