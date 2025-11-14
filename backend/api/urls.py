"""
URL маршруты для API
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ProjectViewSet,
    CustomBlockViewSet,
    RegisterView,
    UserProfileView,
    user_projects,
    subscription_view,
    deploy_view,
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'blocks', CustomBlockViewSet, basename='block')

urlpatterns = [
    path('', include(router.urls)),
    # Авторизация
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    path('auth/my-projects/', user_projects, name='user_projects'),
    path('auth/subscription/', subscription_view, name='subscription'),
    # Деплой
    path('deploy/', deploy_view, name='deploy'),
]

