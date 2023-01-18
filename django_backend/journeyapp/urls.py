from django.urls import path, include
from .views import BoardsAPIView, ThreadsListAPIView, SingleThreadAPIView, CreateNewPostAPIView

urlpatterns = [
    path('api/posting/', CreateNewPostAPIView.as_view()),
    path('api/boards/', BoardsAPIView.as_view()),
    path('api/<str:board>/', ThreadsListAPIView.as_view()),
    path('api/<str:board>/thread/<int:pk>/', SingleThreadAPIView.as_view()),
]

