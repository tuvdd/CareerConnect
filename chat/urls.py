from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, MessageViewSet
from . import views

router = DefaultRouter()
router.register(r'chatrooms', ChatRoomViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path("chat", views.index, name="index"),
    path("chat/<str:room_name>/", views.room, name="room"),

    path('api/', include(router.urls)),
    path('api/chatrooms/<int:pk>/count_unseen_messages/', ChatRoomViewSet.as_view({'get': 'count_unseen_messages'})),
    path('api/chatrooms/get_chat_room_by_keyword/', ChatRoomViewSet.as_view({'get': 'get_chat_room_by_keyword'})),
    path('api/chatrooms/<int:pk>/mark_messages_as_seen/', ChatRoomViewSet.as_view({'put': 'mark_messages_as_seen'})),
    path('api/messages/<int:pk>/delete_message_if_sender/', MessageViewSet.as_view({'delete': 'delete_message_if_sender'})),
]