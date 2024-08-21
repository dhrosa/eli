from uuid import uuid4
from django.urls import reverse
from django.db import models


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


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    audience_name = models.CharField(max_length=255)
    system_prompt = models.TextField()
    query = models.TextField()
    response = models.JSONField()

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse("conversation", kwargs={"pk": self.id})

    @property
    def response_text(self):
        return self.response["content"]["parts"][0]["text"]

    @property
    def ok(self):
        return self.response["finish_reason"] == "STOP"

    class Meta:
        ordering = ["-timestamp"]
