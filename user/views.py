from django.shortcuts import render

from rest_framework import generics
from .models import User, Candidate, Company
from .serializers import UserSerializer, CandidateRegisterSerializer, CompanyRegisterSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.urls import reverse



class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CandidateRegisterView(generics.CreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateRegisterSerializer

class CompanyRegisterView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyRegisterSerializer


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            # User authentication succeeded
            refresh = RefreshToken.for_user(user)

            # Determine the user's role and generate the redirect URL
            role = user.role
            if role == 'company':
                redirect_url = reverse('company_homepage')
            elif role == 'candidate':
                redirect_url = reverse('candidate_homepage')
            else:
                redirect_url = reverse('homepage')  # Default homepage URL

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'redirect_url': redirect_url
            })
        else:
            # User authentication failed
            return Response({'error': 'Invalid credentials'}, status=401)