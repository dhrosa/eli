from django.urls import path, re_path, include

from . import views

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register("query", views.QueryViewSet, basename="query")
router.register("rules", views.RuleViewSet, basename="rule")
router.register("audiences", views.AudienceViewSet, basename="audience")
router.register("conversations", views.ConversationViewSet, basename="conversation")

urlpatterns = [
    path("", views.DefaultView.as_view(), name="home"),
    path("c/", views.DefaultView.as_view(), name="conversation_list"),
    path("c/<pk>/", views.DefaultView.as_view(), name="conversation"),
    path("rules/", views.DefaultView.as_view(), name="rule_list"),
    path("audiences/", views.DefaultView.as_view(), name="audience_list"),
    path("api/", include(router.urls)),
    path("auth/", obtain_auth_token),
]
