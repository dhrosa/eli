from django.urls import path

from . import views

urlpatterns = [
    path("", views.QueryView.as_view(), name="index"),
    path("conversations/<uuid:pk>/", views.ConversationView.as_view(), name="conversation"),
]
