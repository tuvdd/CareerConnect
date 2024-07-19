from django.shortcuts import render

from rest_framework import generics
from .models import User, Candidate, Company
from .serializers import UserSerializer, CandidateRegisterSerializer, CompanyRegisterSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CandidateRegisterView(generics.CreateAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateRegisterSerializer

class CompanyRegisterView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanyRegisterSerializer