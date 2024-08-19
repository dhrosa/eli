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
from .models import Rule, Conversation

@cache
def ai_model():
    generativeai.configure(api_key=settings.GEMINI_API_KEY)
    return generativeai.GenerativeModel("gemini-1.5-flash")


class QueryView(FormView):
    template_name = "eli_app/query.html"
    form_class = QueryForm

    def form_valid(self, form, **kwargs):
        preamble_lines = [c.text for c in Rule.objects.all()]
        preamble = "\n".join(preamble_lines)

        data = form.cleaned_data
        query = data["query"]
        audience = data["audience"]

        prompt = f"{audience.prompt}\n\n{preamble}\n\n{query}"
        response = ai_model().generate_content(prompt)

        print(prompt)
        print(response)
        print(response.text)

        conversation = Conversation.objects.create(
            audience_name=audience.name,
            query=query,
            full_prompt=prompt,
            response_text=response.text,
            response=response.to_dict(),
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
