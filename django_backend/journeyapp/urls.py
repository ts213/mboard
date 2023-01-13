from django.urls import path
from .views import BoardsAPIView, ThreadsAPIView, SingleThreadAPIView


urlpatterns = [
    path('api/boards/', BoardsAPIView.as_view()),
    path('api/<str:board>/', ThreadsAPIView.as_view()),
    path('api/<str:board>/thread/<int:id>/', SingleThreadAPIView.as_view())
]
