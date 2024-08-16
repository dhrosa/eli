from django.contrib import admin

from . import models

admin.site.register(models.CommonSnippet)
admin.site.register(models.Style)
