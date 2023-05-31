from django.urls import path
from .views import BoardsAPI, ThreadAPI, ThreadListAPI, CatalogAPI

urlpatterns = [
    path('api/boards/', BoardsAPI.as_view(), name='boards'),

    path('api/<str:board>/', ThreadListAPI.as_view(), name='board'),
    path('api/<str:board>/catalog/', CatalogAPI.as_view(), name='catalog'),

    path('api/<str:board>/thread/<int:thread_id>/', ThreadAPI.as_view(), name='thread'),
]
