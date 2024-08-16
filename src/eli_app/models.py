from django.db import models

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
    timestamp = models.DateTimeField(auto_now_add=True)
    style = models.ForeignKey(Style, on_delete=models.CASCADE)
    query = models.TextField()
    response_text = models.TextField()
    response = models.JSONField()
