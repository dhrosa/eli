from uuid import uuid4

from django.db import models


class Rule(models.Model):
    name = models.CharField(max_length=255)
    text = models.TextField()

    def __str__(self):
        return self.name


class Audience(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    prompt = models.TextField()

    def __str__(self):
        return self.name


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    audience_name = models.CharField(max_length=255)
    query = models.TextField()
    full_prompt = models.TextField()
    response_text = models.TextField()
    response = models.JSONField()

    def __str__(self):
        return str(self.id)
