from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.QueryView.as_view(), name="home"),
    path("c/", views.ConversationListView.as_view(), name="conversation_list"),
    path("c/<pk>/", views.ConversationView.as_view(), name="conversation"),
    path("rules/", views.RuleListView.as_view(), name="rule_list"),
    path("audiences/", views.AudienceListView.as_view(), name="audience_list"),
]
