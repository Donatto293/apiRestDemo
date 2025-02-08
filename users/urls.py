from django.urls import path, include

from users.views import user_login, user_register, check_auth

from rest_framework.routers import DefaultRouter
from .views import UserViewSet

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'usersList', UserViewSet)

urlpatterns=[
    path('api/', include(router.urls)),# Incluye las rutas del router
    path('register/',user_register, name='register'),
    path('login/', user_login, name='login'),
    path('check-auth/', check_auth, name='check-auth'),
   
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)