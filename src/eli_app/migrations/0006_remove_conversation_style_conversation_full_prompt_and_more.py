# Generated by Django 5.1 on 2024-08-16 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eli_app', '0005_alter_conversation_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='conversation',
            name='style',
        ),
        migrations.AddField(
            model_name='conversation',
            name='full_prompt',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='conversation',
            name='style_name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
