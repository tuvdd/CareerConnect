import json

from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message, ChatRoom


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Save message to database
        await self.save_message_to_database(message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def save_message_to_database(self, message):
        # Find or create the chat room
        chat_room, created = ChatRoom.objects.get_or_create(
            company=self.scope['user'].company,
            candidate=self.scope['user'].candidate
        )

        # Create a new Message instance and save it to the database
        new_message = Message(chat_room=chat_room, sender=self.scope['user'], content=message)
        new_message.save()
    
    async def disconnect(self, close_code):
        # Find the chat room
        chat_room, created = ChatRoom.objects.get_or_create(
            company=self.scope['user'].company,
            candidate=self.scope['user'].candidate
        )

        # Update the last sent message in the ChatRoom object
        chat_room.last_sent_message = Message.objects.latest('timestamp')
        chat_room.save()

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )