from functools import cache
from os import environ

from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from django.views.generic.detail import DetailView
from google import generativeai

from .forms import QueryForm
from .models import CommonSnippet, Conversation


@cache
def ai_model():
    generativeai.configure(api_key=environ["API_KEY"])
    return generativeai.GenerativeModel("gemini-1.5-flash")


class QueryView(FormView):
    template_name = "eli_app/query.html"
    form_class = QueryForm

    def form_valid(self, form, **kwargs):
        preamble_lines = [c.text for c in CommonSnippet.objects.all()]
        preamble = "\n".join(preamble_lines)

        data = form.cleaned_data
        query = data["query"]
        style = data["style"]

        prompt = f"{preamble}\n\n{style.prompt}\n\n{query}"
        response = ai_model().generate_content(prompt)

        conversation = Conversation.objects.create(
            style_name=style.name,
            query=query,
            full_prompt=prompt,
            response_text=response.text,
            response=response.to_dict(),
        )

        context = self.get_context_data(**kwargs)
        context["previous_query"] = query
        context["previous_response"] = response.text
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class ConversationView(DetailView):
    #template_name = "eli_app/conversation.html"
    model = Conversation
