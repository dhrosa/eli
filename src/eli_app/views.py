from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import FormView

from .forms import QueryForm

from google import generativeai
from os import environ

generativeai.configure(api_key=environ["API_KEY"])
ai_model = generativeai.GenerativeModel('gemini-1.5-flash')

preamble = """
Answer the following question as if you were explaining this concept to a ten-year old.
Limit your response to 5 sentences. Don't use excessive exclamation marks.

"""

class QueryView(FormView):
    template_name = "eli_app/query.html"
    form_class = QueryForm

    def form_valid(self, form, **kwargs):
        query = form.cleaned_data["query"]
        response = ai_model.generate_content(preamble + query).text

        context = self.get_context_data(**kwargs)
        context["previous_query"] = query
        context["previous_response"] = response
        return self.render_to_response(context)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
