from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import FormView

from .forms import QueryForm


def submit(request: HttpRequest) -> HttpResponse:
    return HttpResponse(str(request.POST))


class IndexView(FormView):
    template_name = "eli_app/index.html"
    form_class = QueryForm


class SubmitView(TemplateView):
    template_name = "eli_app/submit.html"

    def post(self, request, *args, **kwargs):
        print(request.POST)
        return HttpResponseRedirect(reverse("index"))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
