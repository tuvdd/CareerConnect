from django.urls import path, include
from rest_framework import routers
from .views import JobViewSet, ApplicationViewSet

router = routers.DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'applications', ApplicationViewSet)

urlpatterns = [
    # Other URL patterns
    path('api/', include(router.urls)),
]