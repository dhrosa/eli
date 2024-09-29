# Generated by Django 5.1 on 2024-08-23 18:00

from django.db import migrations, models

import eli_app.models


class Migration(migrations.Migration):

    dependencies = [
        ("eli_app", "0004_remove_conversation_response_text"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="audience",
            options={"ordering": ["name"]},
        ),
        migrations.AlterModelOptions(
            name="conversation",
            options={"ordering": ["-timestamp"]},
        ),
        migrations.AlterField(
            model_name="conversation",
            name="id",
            field=models.CharField(
                default=eli_app.models.random_id,
                editable=False,
                max_length=24,
                primary_key=True,
                serialize=False,
            ),
        ),
    ]
