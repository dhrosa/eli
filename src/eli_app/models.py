from django.db import models

class Style(models.Model):
    name = models.TextField()
    description = models.TextField()
    prompt = models.TextField()

    def __str__(self):
        return self.name

class Conversation(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    style = models.ForeignKey(Style, on_delete=models.CASCADE)
    query = models.TextField()
    response = models.TextField()
