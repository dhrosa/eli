# Generated by Django 5.1 on 2024-08-24 17:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("eli_app", "0005_alter_audience_options_alter_conversation_options_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="conversation",
            old_name="response",
            new_name="raw_response",
        ),
        migrations.AddField(
            model_name="conversation",
            name="structured_response",
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
    ]
