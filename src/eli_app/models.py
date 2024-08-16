from django.db import models
from uuid import uuid4

class CommonSnippet(models.Model):
    name = models.CharField(max_length=255)
    text = models.TextField()

    def __str__(self):
        return self.name

class Style(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    prompt = models.TextField()

    def __str__(self):
        return self.name


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    style_name = models.CharField(max_length=255)
    query = models.TextField()
    full_prompt=models.TextField()
    response_text = models.TextField()
    response = models.JSONField()

    def __str__(self):
        return "id={self.id} style={self.style_name}"
