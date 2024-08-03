from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from rest_framework.response import Response

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

    # API endpoint để đếm số tin nhắn chưa đọc trong một phòng trò chuyện
    def count_unseen_messages(self, request, pk=None):
        chat_room = self.get_object()
        unseen_messages_count = Message.objects.filter(chat_room=chat_room, seen=False).count()
        return Response({'unseen_messages_count': unseen_messages_count})

    # API endpoint để tìm phòng trò chuyện dựa trên từ khóa (company và candidate)
    def get_chat_room_by_keyword(self, request):
        company_id = request.query_params.get('company_id')
        candidate_id = request.query_params.get('candidate_id')

        if company_id and candidate_id:
            # Tìm phòng trò chuyện dựa trên cả hai ID
            chat_rooms = ChatRoom.objects.filter(company_id=company_id, candidate_id=candidate_id)
        elif company_id:
            # Tìm các phòng trò chuyện dựa trên company_id
            chat_rooms = ChatRoom.objects.filter(company_id=company_id)
        elif candidate_id:
            # Tìm các phòng trò chuyện dựa trên candidate_id
            chat_rooms = ChatRoom.objects.filter(candidate_id=candidate_id)
        else:
            return Response({'message': 'Please provide either company_id or candidate_id'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ChatRoomSerializer(chat_rooms, many=True)
        return Response(serializer.data)
    
    # API endpoint để đánh dấu tin nhắn là đã đọc 
    def mark_messages_as_seen(self, request, pk=None):
        chat_room = self.get_object()
        user_id = request.data.get('user_id', None)  # Lấy user_id từ request data

        if user_id is not None:
            unseen_messages = Message.objects.filter(chat_room=chat_room, receiver_id=user_id, seen=False)            
            for message in unseen_messages:
                message.seen = True
                message.save()
                
            return Response({'message': 'Marked all unseen messages as seen for the user.'})
        else:
            return Response({'message': 'User ID is missing in the request data.'})

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    # API endpoint để xóa tin nhắn nếu người dùng là người gửi
    def delete_message_if_sender(self, request, pk=None):
        message = self.get_object()
        if message.sender == request.user:
            message.delete()
            return Response({'message': 'Message deleted successfully'})
        else:
            return Response({'message': 'You are not the sender of this message'}, status=403)