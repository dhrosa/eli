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
    url = serializers.SerializerMethodField()
    def get_url(self, obj):
        return obj.get_absolute_url()

    class Meta:
        model = models.Conversation
        fields = '__all__'
