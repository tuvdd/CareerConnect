from django.urls import path, include
from rest_framework import routers
from .views import CandidateViewSet, CompanyViewSet

router = routers.DefaultRouter()
router.register(r'candidates', CandidateViewSet)
router.register(r'companies', CompanyViewSet)

urlpatterns = [
    # Other URL patterns
    path('api/', include(router.urls)),
]