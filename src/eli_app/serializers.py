from rest_framework import serializers
from . import models

class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rule
        fields = '__all__'

class AudienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Audience
        fields = '__all__'

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Conversation
        fields = '__all__'
