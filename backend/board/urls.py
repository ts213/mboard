from django.urls import path
from .views import *

urlpatterns = [
    path('api/delete/<int:pk>/', DeletePostAPIView.as_view()),
    path('api/edit/', EditPostAPI.as_view()),
    path('api/boards/', BoardsAPI.as_view()),
    path('api/feed/', FeedAPI.as_view()),
    path('api/<str:board>/', ThreadListAPI.as_view()),
    path('api/<str:board>/thread/<int:thread_id>/', ThreadAPI.as_view()),
    path('api/post/<int:post_id>/', PostAPI.as_view()),
]
