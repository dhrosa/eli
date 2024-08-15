from django.urls import path

from . import views

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("submit", views.SubmitView.as_view(), name="submit"),
]
