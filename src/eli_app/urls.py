from django.urls import path, re_path, include

from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("rules", views.RuleViewSet, basename="rule")
router.register("audiences", views.RuleViewSet, basename="audience")
router.register("conversations", views.ConversationViewSet, basename="conversation")

urlpatterns = [
    path("", views.QueryView.as_view(), name="home"),
    path("c/", views.ConversationListView.as_view(), name="conversation_list"),
    path("c/<pk>/", views.ConversationView.as_view(), name="conversation"),
    path("rules/", views.RuleListView.as_view(), name="rule_list"),
    path("audiences/", views.AudienceListView.as_view(), name="audience_list"),
    path("api/", include(router.urls)),
]
