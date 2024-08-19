from functools import cache

from django.conf import settings

from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from google import generativeai

from .forms import QueryForm
from .models import Rule, Conversation, Audience

def ai_model(**kwargs):
    generativeai.configure(api_key=settings.GEMINI_API_KEY)
    return generativeai.GenerativeModel("gemini-1.5-flash", **kwargs)


class QueryView(FormView):
    template_name = "eli_app/query.html"
    form_class = QueryForm

    def form_valid(self, form, **kwargs):

        data = form.cleaned_data
        query = data["query"]
        audience = data["audience"]

        system_prompt_lines = [r.text for r in Rule.objects.all()]
        system_prompt_lines.append(audience.prompt)
        system_prompt = "\n".join(system_prompt_lines)

        model = ai_model(system_instruction=system_prompt)

        response = model.generate_content(query).candidates[0]
        response_dict = type(response).to_dict(response, use_integers_for_enums=False)

        conversation = Conversation.objects.create(
            audience_name=audience.name,
            system_prompt=system_prompt,
            query=query,
            response=response_dict,
        )
        context = self.get_context_data(**kwargs)
        context["conversation"] = conversation
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class ConversationView(DetailView):
    model = Conversation

class ConversationListView(ListView):
    model = Conversation

class RuleListView(ListView):
    model = Rule

class AudienceListView(ListView):
    model = Audience
