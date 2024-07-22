from django.urls import path
from .views import (
    CandidateListAPIView,
    CandidateDetailAPIView,
    CompanyListAPIView,
    CompanyDetailAPIView,
)

urlpatterns = [
    path('api/candidates/', CandidateListAPIView.as_view(), name='candidate-list'),
    path('api/candidates/<int:pk>/', CandidateDetailAPIView.as_view(), name='candidate-detail'),
    path('api/companies/', CompanyListAPIView.as_view(), name='company-list'),
    path('api/companies/<int:pk>/', CompanyDetailAPIView.as_view(), name='company-detail'),
]