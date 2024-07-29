import os

from django.contrib.auth import authenticate
from django.http import HttpResponse
from rest_framework import generics, permissions, viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from config import settings
from config.settings import storage
from .models import User, Candidate, Company, Admin
from .serializers import (
    UserSerializer,
    CandidateRegisterSerializer,
    CompanyRegisterSerializer,
    LoginSerializer,
    CandidateSerializer,
    CompanySerializer,
    AdminCreateSerializer,
    AdminSerializer
)


class UserCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        }
        return Response(user_data, status=status.HTTP_200_OK)


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


class CandidateListAPIView(generics.ListAPIView):
    serializer_class = CandidateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Candidate.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class CandidateDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [permissions.IsAuthenticated]


    def put(self, request, *args, **kwargs):
        instance = self.get_object()

        image_files = request.FILES.getlist('image')
        resume_files = request.FILES.getlist('resumes')

        data = request.data.copy()
        image_url = None
        resume_url = None

        if image_files:
            image = image_files[0]
            ext = os.path.splitext(image.name)[1]
            unique_filename = f"candidate_{instance.id}_image{ext}"

            storage = settings.storage
            path_on_cloud = f"candidates/{unique_filename}"

            try:
                storage.child(path_on_cloud).put(image)
                image_url = storage.child(path_on_cloud).get_url(None)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            data['image'] = image_url

        if resume_files:
            resumes = []
            for resume in resume_files:
                unique_filename = resume.name  # Sử dụng tên file gốc làm unique_filename
                path_on_cloud = f"candidates/{instance.id}/resumes/{unique_filename}"

                storage = settings.storage

                try:
                    storage.child(path_on_cloud).put(resume)
                    resume_url = storage.child(path_on_cloud).get_url(None)
                    resumes.append(resume_url)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            merge_resume_list = list(set(resumes) | set(instance.resumes))
            data.setlist('resumes', merge_resume_list)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        instance = Candidate.objects.get(pk=kwargs.get('pk'))
        resume_path = f'candidates/candidate_{instance.id}_resume.pdf'  # Đường dẫn tới file resume trên Firebase Storage

        candidate_name = f"{instance.firstname}_{instance.lastname}"
        filename = f"{candidate_name}_resume.pdf"

        # Lấy path download mặc định của system
        download_path = ''
        if os.name == 'nt':  # Nếu là Windows
            download_path = os.path.join(os.path.expanduser('~'), 'Downloads')
        elif os.name == 'posix':  # Nếu là Unix/Linux/MacOS
            download_path = os.path.join(os.path.expanduser('~'), 'Downloads')
        else:
            download_path = os.getcwd()  # Sử dụng thư mục làm việc hiện tại làm mặc định

        try:

            try:
                destination_path = os.path.join(download_path, filename)
                storage.child(resume_path).download(download_path, destination_path) 
            except Exception:
                current_work_dir = os.getcwd()
                destination_path = os.path.join(current_work_dir, filename)
                storage.child(resume_path).download(current_work_dir, destination_path) 

            with open(destination_path, "rb") as file:
                    resume_file = file.read()
                    response = HttpResponse(resume_file, content_type='application/pdf')
                    response['Content-Disposition'] = f'inline; filename="{filename}"'
                    return response        
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ResumeDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        try:
            instance = Candidate.objects.get(pk=pk)
            resume_url = instance.resume

            if resume_url:
                try:
                    instance.resume = ''
                    instance.save()

                    return Response({'status': 'Resume deleted and candidate updated'}, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'No resume found to delete'}, status=status.HTTP_404_NOT_FOUND)
        except Candidate.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)

class CompanyListAPIView(generics.ListAPIView):
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Company.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class CompanyDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        instance = self.get_object()

        image_files = request.FILES.getlist('logo')
        image_url = None

        if image_files:
            image = image_files[0]
            ext = os.path.splitext(image.name)[1]
            unique_filename = f"company_{instance.id}_logo{ext}"

            storage = settings.storage
            path_on_cloud = f"companies/{unique_filename}"

            try:
                storage.child(path_on_cloud).put(image)
                image_url = storage.child(path_on_cloud).get_url(None)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        if image_url:
            data['logo'] = image_url

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class AdminCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = Admin.objects.all()
    serializer_class = AdminCreateSerializer


class AdminListAPIView(generics.ListAPIView):
    serializer_class = AdminSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Admin.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class AdminDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [permissions.IsAuthenticated]
