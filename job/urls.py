from django.urls import path
from .views import (
    JobCreateAPIView,
    JobListAPIView,
    JobDetailAPIView,
    JobListByCompanyAPIView,
    ApplicationCreateAPIView,
    ApplicationListAPIView,
    ApplicationDetailAPIView,
    ApplicationListByJobAPIView,
    ApplicationListByCandidateAPIView,
    ApplyForJobAPIView
)

urlpatterns = [
    path('api/jobs/create/', JobCreateAPIView.as_view(), name='job-create'),
    path('api/jobs/', JobListAPIView.as_view(), name='job-list'),
    path('api/jobs/<int:pk>/', JobDetailAPIView.as_view(), name='job-detail'),
    path('api/companies/<int:company_id>/jobs/', 
         JobListByCompanyAPIView.as_view(), 
         name='job-list-by-company'),
    

    path('api/applications/create/', ApplicationCreateAPIView.as_view(), name='application-create'),
    path('api/applications/', ApplicationListAPIView.as_view(), name='application-list'),
    path('api/jobs/<int:job_id>/applications/', 
         ApplicationListByJobAPIView.as_view(), 
         name='application-list-by-job'),
    path('api/candidates/<int:candidate_id>/applications/', 
            ApplicationListByCandidateAPIView.as_view(), 
            name='application-list-by-candidate'),
    path('api/applications/<int:pk>/', ApplicationDetailAPIView.as_view(), name='application-detail'),
    path('api/jobs/<int:job_id>/apply/', ApplyForJobAPIView.as_view(), name='apply-for-job'),
]