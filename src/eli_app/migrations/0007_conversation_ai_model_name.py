# Generated by Django 5.1 on 2024-08-25 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("eli_app", "0006_rename_response_conversation_raw_response_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="conversation",
            name="ai_model_name",
            field=models.CharField(default="", max_length=255),
            preserve_default=False,
        ),
    ]
