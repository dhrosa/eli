from django.contrib import admin

from . import models


@admin.register(models.Conversation)
class ConversationAdmin(admin.ModelAdmin):
    model = models.Conversation
    list_display = ("id", "audience_name", "query")


admin.site.register(models.Rule)
admin.site.register(models.Audience)
