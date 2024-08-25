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

from rest_framework import viewsets


class QueryView(FormView):
    template_name = "eli_app/query.html"
    form_class = QueryForm

    def get_initial(self):
        return self.request.POST

    def form_valid(self, form, **kwargs):
        data = form.cleaned_data
        query = data["query"]
        audience = data["audience"]

        system_prompt_lines = [r.text for r in Rule.objects.all()]
        system_prompt_lines.append(audience.prompt)
        system_prompt = "\n".join(system_prompt_lines)

        conversation = Conversation(
            audience_name=audience.name,
            system_prompt=system_prompt,
            query=query,
        )
        ai.fill_completion(conversation, ai.AiModelName[data["ai_model"]])
        conversation.save()

        context = self.get_context_data(**kwargs)
        context["conversation"] = conversation
        return self.render_to_response(context)


class RuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rule.objects.all()
    serializer_class = serializers.RuleSerializer

class AudienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Audience.objects.all()
    serializer_class = serializers.AudienceSerializer

class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = serializers.ConversationSerializer


class ConversationView(DetailView):
    model = Conversation

class ConversationListView(ListView):
    model = Conversation
    paginate_by = 10

class RuleListView(ListView):
    model = Rule

class AudienceListView(ListView):
    model = Audience
