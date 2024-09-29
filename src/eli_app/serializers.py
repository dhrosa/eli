from rest_framework import serializers

from . import ai, models


class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rule
        fields = "__all__"


class AudienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Audience
        fields = "__all__"


class ConversationSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return obj.get_absolute_url()

    class Meta:
        model = models.Conversation
        fields = "__all__"


class QuerySerializer(serializers.Serializer):
    audience = serializers.ChoiceField(choices=[])
    ai_model_name = serializers.ChoiceField([(m.name, m.value) for m in ai.AiModelName])
    query = serializers.CharField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["audience"].choices = [
            (a.id, a.name) for a in models.Audience.objects.all()
        ]


class QuerySuggestionRequestSerializer(serializers.Serializer):
    count = serializers.IntegerField(default=10)
    temperature = serializers.FloatField(min_value=0, max_value=2, default=1)
