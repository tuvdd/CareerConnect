from django.urls import path
from .views import (
    JobCreateAPIView,
    JobListAPIView,
    JobDetailAPIView,
    ApplicationCreateAPIView,
    ApplicationListAPIView,
    ApplicationDetailAPIView,
)

urlpatterns = [
    path('api/jobs/create/', JobCreateAPIView.as_view(), name='job-create'),
    path('api/jobs/', JobListAPIView.as_view(), name='job-list'),
    path('api/jobs/<int:pk>/', JobDetailAPIView.as_view(), name='job-detail'),
    path('api/applications/create/', ApplicationCreateAPIView.as_view(), name='application-create'),
    path('api/applications/', ApplicationListAPIView.as_view(), name='application-list'),
    path('api/applications/<int:pk>/', ApplicationDetailAPIView.as_view(), name='application-detail'),
]