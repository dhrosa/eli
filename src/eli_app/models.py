from django.db import models


class Conversation(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    query = models.TextField()
    response = models.TextField()
