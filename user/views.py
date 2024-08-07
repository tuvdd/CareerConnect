import os

import requests
from django.contrib.auth import authenticate
from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from config import settings
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
            if user.role == 'candidate':
                try:
                    candidate = Candidate.objects.get(user=user)
                    if candidate.status == 'Locked':
                        return Response({"error": "Tài khoản của bạn đã bị khóa."}, status=403)
                except Candidate.DoesNotExist:
                    return Response({"error": "Không tìm thấy thông tin ứng viên."}, status=404)

            elif user.role == 'company':
                try:
                    company = Company.objects.get(user=user)
                    if company.status == 'Locked':
                        return Response({"error": "Tài khoản công ty của bạn đã bị khóa."}, status=403)
                except Company.DoesNotExist:
                    return Response({"error": "Không tìm thấy thông tin công ty."}, status=404)

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "redirect_url": user.role,
                }
            )
        else:
            return Response({"error": "Thông tin đăng nhập không hợp lệ."}, status=401)


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
        resume_files = request.FILES.getlist('resume')

        image_url = None
        resumes = list(instance.resumes or [])

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

        if resume_files:
            new_resume_urls = []
            for resume in resume_files:
                unique_filename = resume.name
                path_on_cloud = f"candidates/{instance.id}/resumes/{unique_filename}"

                try:
                    storage = settings.storage
                    storage.child(path_on_cloud).put(resume)
                    resume_url = storage.child(path_on_cloud).get_url(None)
                    new_resume_urls.append(resume_url)
                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            resumes.extend(new_resume_urls)

        data = {
            'image': image_url if image_url else instance.image,
            'resumes': resumes,
            **{key: value for key, value in request.data.items() if key not in ['image', 'resume']}
        }

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ResumeDownloadAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        instance = Candidate.objects.get(pk=kwargs.get('pk'))
        resume_url = request.data.get('resume_url')

        candidate_name = f"{instance.firstname}_{instance.lastname}"
        download_filename = f"{candidate_name}_resume.pdf"

        # Lấy path download mặc định của system
        download_path = ''
        if os.name == 'nt':  # Nếu là Windows
            download_path = os.path.join(os.path.expanduser('~'), 'Downloads')
        elif os.name == 'posix':  # Nếu là Unix/Linux/MacOS
            download_path = os.path.join(os.path.expanduser('~'), 'Downloads')
        else:
            download_path = os.getcwd()  # Sử dụng thư mục làm việc hiện tại làm mặc định

        try:
            respone_download = requests.get(resume_url)
            try:
                destination_path = os.path.join(download_path, download_filename)
                with open(destination_path, 'wb') as file:
                    file.write(respone_download.content)

            except Exception:
                current_work_dir = os.getcwd()
                destination_path = os.path.join(current_work_dir, download_filename)
                with open(destination_path, 'wb') as file:
                    file.write(respone_download.content)

            if os.path.exists(destination_path):
                result_message = f"File downloaded successfully to: {destination_path}"
            else:
                result_message = "File download failed. Please try again"

            return HttpResponse(result_message, content_type='text/plain')

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ResumeDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        resume_url = request.data.get('resume_url')

        try:
            instance = Candidate.objects.get(pk=pk)
            if resume_url:
                try:
                    instance.resumes.remove(resume_url)
                    instance.save()
                    response = requests.delete(resume_url)
                    if str(response.status_code).startswith("20"):
                        return Response({'status': 'Resume deleted and candidate updated'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'status': 'Resume file not deleted and candidate updated'},
                                        status=status.HTTP_400_BAD_REQUEST)

                except Exception as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Missing resume_url parameter'}, status=status.HTTP_404_NOT_FOUND)
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
