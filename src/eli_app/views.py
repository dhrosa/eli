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

def submit(request: HttpRequest) -> HttpResponse:
    return HttpResponse(str(request.POST))


class IndexView(FormView):
    template_name = "eli_app/index.html"
    form_class = QueryForm


class SubmitView(TemplateView):
    template_name = "eli_app/submit.html"

    def post(self, request, *args, **kwargs):
        query = preamble + request.POST["query"]
        ai_response = ai_model.generate_content(query)
        print(ai_response.text)
        return HttpResponseRedirect(reverse("index"))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
