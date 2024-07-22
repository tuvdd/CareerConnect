"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

from user.views import (
    UserCreateView,
    CandidateRegisterView,
    CompanyRegisterView,
    LoginAPIView,
    ProtectedView,
    CandidateProfileView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/",
        include(
            [
                path(
                    "candidate/register/",
                    CandidateRegisterView.as_view(),
                    name="candidate-register",
                ),
                path(
                    "company/register/",
                    CompanyRegisterView.as_view(),
                    name="company-register",
                ),
                path("login/", LoginAPIView.as_view(), name="login"),
                path(
                    "token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
                ),
                path("protected/", ProtectedView.as_view(), name="protected"),
                path(
                    "candidate/profile/",
                    CandidateProfileView.as_view(),
                    name="candidate_profile",
                ),
            ]
        ),
    ),
]
