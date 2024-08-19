from django.urls import path

from . import views

urlpatterns = [
    path("", views.QueryView.as_view(), name="home"),
    path("conversations/", views.ConversationListView.as_view(), name="conversation_list"),
    path("conversations/<uuid:pk>/", views.ConversationView.as_view(), name="conversation"),
    path("rules/", views.RuleListView.as_view(), name="rule_list"),
    path("audiences/", views.AudienceListView.as_view(), name="audience_list"),
]
