from secrets import token_urlsafe

from django.db import models
from django.urls import reverse


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
        return self.name

    class Meta:
        ordering = ["name"]


def random_id():
    # 48-bit value. Can be expanded to 128-bit if needed.
    return token_urlsafe(48 // 8)


class Conversation(models.Model):
    # 24 bytes is enough to represent a 128-bit value as base64
    id = models.CharField(
        primary_key=True, max_length=24, default=random_id, editable=False
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    audience_name = models.CharField(max_length=255)
    ai_model_name = models.CharField(max_length=255)
    system_prompt = models.TextField()
    query = models.TextField()

    chat_response_event = models.ForeignKey(
        to="ChatResponseEvent",
        blank=True,
        null=True,
        on_delete=models.DO_NOTHING,
    )

    response_title = models.TextField()
    response_text = models.TextField()

    def __str__(self):
        return str(self.id)

    def get_absolute_url(self):
        return reverse("conversation", kwargs={"pk": self.id})

    @property
    def has_image(self):
        return hasattr(self, "generatedimage")

    class Meta:
        ordering = ["-timestamp"]


class ChatResponseEvent(models.Model):
    """ChatGPT Chat Completion history."""

    # 24 bytes is enough to represent a 12[8-bit value as base64
    id = models.CharField(
        primary_key=True, max_length=24, default=random_id, editable=False
    )
    system_prompt = models.TextField()
    prompt = models.TextField()
    response = models.JSONField()


class GeneratedImage(models.Model):
    conversation = models.OneToOneField(
        to=Conversation, on_delete=models.CASCADE, primary_key=True
    )

    start_timestamp = models.DateTimeField(auto_now_add=True)
    revised_prompt = models.TextField(blank=True)
    data = models.BinaryField(blank=True)
