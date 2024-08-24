from uuid import uuid4
from django.urls import reverse
from django.db import models
from secrets import token_urlsafe

class Rule(models.Model):
    name = models.CharField(max_length=255)
    text = models.TextField()

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name,)


class Audience(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    prompt = models.TextField()

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name)

    class Meta:
        ordering = ["name"]

def random_id():
    # 48-bit value. Can be expanded to 128-bit if needed.
    return token_urlsafe(48 // 8)

class Conversation(models.Model):
    # 24 bytes is enough to represent a 128-bit value as base64
    id = models.CharField(primary_key=True, max_length=24, default=random_id, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    audience_name = models.CharField(max_length=255)
    system_prompt = models.TextField()
    query = models.TextField()
    raw_response = models.JSONField()
    structured_response = models.JSONField()

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse("conversation", kwargs={"pk": self.id})

    @property
    def response_text(self):
        return self.structured_response["text"]

    @property
    def title(self):
        return self.structured_response["title"]

    @property
    def ok(self):
        return self.raw_response["finish_reason"] == "STOP"

    class Meta:
        ordering = ["-timestamp"]
