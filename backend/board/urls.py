from django.urls import path
from .views import *

urlpatterns = [
    path('api/delete/<int:pk>/', DeletePostAPIView.as_view()),
    path('api/edit/', EditPostAPIView.as_view()),
    path('api/boards/', BoardsAPIView.as_view()),
    path('api/<str:board>/', ThreadListAPIView.as_view()),
    path('api/<str:board>/thread/<int:thread_id>/', SingleThreadAPIView.as_view()),
]
