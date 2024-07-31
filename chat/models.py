from django.db import models
from user.models import User, Company, Candidate

class ChatRoom(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_sent_message = models.ForeignKey('Message', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'Chat between {self.company.name} and {self.candidate.firstname}'

# Create your models here.
class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)  # Track if the message has been seen by the receiver

    def __str__(self):
        return f'{self.sender.email} to {self.receiver.email} in {self.chat_room}'
    
