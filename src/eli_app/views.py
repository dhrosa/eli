from functools import cache

from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .forms import QueryForm
from . import ai, serializers
from .models import Rule, Conversation, Audience

from rest_framework import viewsets, views, mixins, response

class DefaultView(TemplateView):
    template_name="eli_app/base.html"

class RuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = serializers.RuleSerializer

class AudienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Audience.objects.all()
    serializer_class = serializers.AudienceSerializer

class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = serializers.ConversationSerializer

class QueryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = serializers.QuerySerializer

    def create(self, request):
        input_data = serializers.QuerySerializer(data=request.data)
        input_data.is_valid(raise_exception=True)

        data = input_data.validated_data
        audience = Audience.objects.get(pk=data["audience"])

        system_prompt_lines = [r.text for r in Rule.objects.all()]
        system_prompt_lines.append(audience.prompt)
        system_prompt = "\n".join(system_prompt_lines)

        conversation = Conversation(
            audience_name=audience.name,
            system_prompt=system_prompt,
            query=data["query"],
        )
        ai.fill_completion(conversation, ai.AiModelName[data["ai_model_name"]])
        conversation.save()

        return response.Response(data=serializers.ConversationSerializer(conversation).data)
