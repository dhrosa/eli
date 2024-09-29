from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("query", views.QueryViewSet, basename="query")
router.register("rules", views.RuleViewSet, basename="rule")
router.register("audiences", views.AudienceViewSet, basename="audience")
router.register("conversations", views.ConversationViewSet, basename="conversation")

urlpatterns = [
    path("c/", views.DefaultView.as_view(), name="conversation_list"),
    path("c/<pk>/", views.DefaultView.as_view(), name="conversation"),
    path("rules/", views.DefaultView.as_view(), name="rule_list"),
    path("audiences/", views.DefaultView.as_view(), name="audience_list"),
    path("api/", include(router.urls)),
    path("token/", views.TokenView.as_view()),
    re_path(".*", views.DefaultView.as_view(), name="home"),
]
