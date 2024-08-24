from functools import cache

from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import FormView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView

from .forms import QueryForm
from . import ai
from .models import Rule, Conversation, Audience


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
        ai.fill_gemini_completion(conversation)
        conversation.save()
        context = self.get_context_data(**kwargs)
        context["conversation"] = conversation
        print(conversation.title)
        return self.render_to_response(context)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class ConversationView(DetailView):
    model = Conversation

class ConversationListView(ListView):
    model = Conversation
    paginate_by = 10

class RuleListView(ListView):
    model = Rule

class AudienceListView(ListView):
    model = Audience
