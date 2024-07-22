from django.shortcuts import render

from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import User, Candidate, Company
from .serializers import (
    UserSerializer,
    CandidateRegisterSerializer,
    CompanyRegisterSerializer,
    LoginSerializer,
    CandidateSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.urls import reverse


class UserCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CandidateRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Candidate.objects.all()
    serializer_class = CandidateRegisterSerializer


class CompanyRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Company.objects.all()
    serializer_class = CompanyRegisterSerializer


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None:
            # User authentication succeeded
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "redirect_url": user.role,
                }
            )
        else:
            # User authentication failed
            return Response({"error": "Invalid credentials"}, status=401)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected view!"})


class CandidateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
