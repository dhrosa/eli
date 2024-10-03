import time

from django.http import HttpResponse
from django.views.generic import TemplateView
from rest_framework import response, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from . import ai, serializers
from .models import Audience, Conversation, Rule


class TokenView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return response.Response(
            {
                "token": token.key,
                "username": user.username,
            }
        )


class DefaultView(TemplateView):
    template_name = "eli_app/base.html"


class ModelViewSet(viewsets.ModelViewSet):
    @action(detail=False)
    def export(self, request):
        return Response({"cat": "dog"})


class RuleViewSet(ModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = serializers.RuleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AudienceViewSet(ModelViewSet):
    queryset = Audience.objects.all()
    serializer_class = serializers.AudienceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ConversationViewSet(ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = serializers.ConversationSerializer

    @action(detail=True, methods=["get"])
    def image(self, request, pk):
        conversation = self.get_object()
        if conversation.has_image:
            while not conversation.generatedimage.data:
                time.sleep(0.2)
                conversation.refresh_from_db()

        else:
            ai.generate_image(conversation)
        return HttpResponse(conversation.generatedimage.data, content_type="image/png")


class QueryViewSet(viewsets.GenericViewSet):
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

        return response.Response(
            data=serializers.ConversationSerializer(conversation).data
        )

    @action(methods=["get"], detail=False, renderer_classes=[JSONRenderer])
    def suggest(self, request):
        input_data = serializers.QuerySuggestionRequestSerializer(data=request.data)
        input_data.is_valid(raise_exception=True)

        return response.Response(data=ai.query_suggestions(input_data.validated_data))
