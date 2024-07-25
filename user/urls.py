from django.urls import path, include

from .views import (
    UserCreateView,
    UserDetailAPIView,
    CandidateListAPIView,
    CandidateDetailAPIView,
    CompanyListAPIView,
    CompanyDetailAPIView,
    AdminCreateView,
    AdminListAPIView,
    AdminDetailAPIView,
    ResumeView,
)

urlpatterns = [
    path('api/user-create/', UserCreateView.as_view(), name='user-create'),
    path('api/user/', UserDetailAPIView.as_view(), name='user-detail'),
    path('api/candidates/', CandidateListAPIView.as_view(), name='candidate-list'),
    path('api/candidates/<int:pk>/', CandidateDetailAPIView.as_view(), name='candidate-detail'),
    path('api/candidates/<int:pk>/view_resume/', ResumeView.as_view(), name='view_resume'),
    path('api/companies/', CompanyListAPIView.as_view(), name='company-list'),
    path('api/companies/<int:pk>/', CompanyDetailAPIView.as_view(), name='company-detail'),
    path('api/admin-create/', AdminCreateView.as_view(), name='admin-create'),
    path('api/admin/', AdminListAPIView.as_view(), name='admin-list'),
    path('api/admin/<int:pk>/', AdminDetailAPIView.as_view(), name='admin-detail')
]
