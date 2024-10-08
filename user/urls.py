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
    ResumeDownloadAPIView,
    ResumeDeleteAPIView
)

urlpatterns = [
    path('api/user-create/', UserCreateView.as_view(), name='user-create'),
    path('api/user/', UserDetailAPIView.as_view(), name='user-detail'),
    path('api/candidates/', CandidateListAPIView.as_view(), name='candidate-list'),
    path('api/candidates/<int:pk>/', CandidateDetailAPIView.as_view(), name='candidate-detail'),

    # Download and delete need url of resume in request, "resume_url"
    path('api/candidates/<int:pk>/download_resume/', ResumeDownloadAPIView.as_view(), name='download_resume'), 
    path('api/candidates/<int:pk>/delete_resume/', ResumeDeleteAPIView.as_view(), name='delete_resume'),
    
    path('api/companies/', CompanyListAPIView.as_view(), name='company-list'),
    path('api/companies/<int:pk>/', CompanyDetailAPIView.as_view(), name='company-detail'),
    path('api/admin-create/', AdminCreateView.as_view(), name='admin-create'),
    path('api/admin/', AdminListAPIView.as_view(), name='admin-list'),
    path('api/admin/<int:pk>/', AdminDetailAPIView.as_view(), name='admin-detail')
]
