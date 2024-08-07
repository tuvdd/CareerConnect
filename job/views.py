from django.db.models import Count
from rest_framework import generics, permissions, filters, status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer, CreateJobSerializer, CreateApplicationSerializer
from django_filters.rest_framework import DjangoFilterBackend
import django_filters


class JobFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    location = django_filters.CharFilter(lookup_expr='icontains')
    salary = django_filters.RangeFilter()
    status = django_filters.CharFilter(lookup_expr='iexact')
    company__name = django_filters.CharFilter(field_name='company__name', lookup_expr='icontains')

    class Meta:
        model = Job
        fields = ['title', 'location', 'salary', 'status', 'company__name']


class ApplicationFilter(django_filters.FilterSet):
    date = django_filters.DateFromToRangeFilter(field_name='date')
    status = django_filters.CharFilter(field_name='status', lookup_expr='icontains')
    candidate__firstname = django_filters.CharFilter(field_name='candidate__firstname', lookup_expr='icontains')
    candidate__lastname = django_filters.CharFilter(field_name='candidate__lastname', lookup_expr='icontains')
    job__title = django_filters.CharFilter(field_name='job__title', lookup_expr='icontains')

    class Meta:
        model = Application
        fields = ['date', 'status', 'candidate__firstname', 'candidate__lastname', 'job__title']


class JobCreateAPIView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = CreateJobSerializer
    permission_classes = [permissions.IsAuthenticated]


class JobListAPIView(generics.ListAPIView):
    queryset = Job.objects.all().order_by('-post_date')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobFilter
    search_fields = ["title", "company__name"]


class JobDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        Application.objects.filter(job=job).delete()
        self.perform_destroy(job)
        return Response(status=status.HTTP_204_NO_CONTENT)


class JobListByCompanyAPIView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        return Job.objects.filter(company_id=company_id).order_by('-post_date')


class TopJobsAPIView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.annotate(num_applications=Count('application')).order_by('-num_applications')[:3]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicationCreateAPIView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = CreateApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]


class ApplicationListAPIView(generics.ListAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ApplicationFilter
    search_fields = ["candidate__firstname", "candidate__lastname", "job__title"]


class ApplicationListByJobAPIView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs['job_id']
        return Application.objects.filter(job_id=job_id)


class ApplicationPagination(PageNumberPagination):
    page_size = 5


class ApplicationListByCandidateAPIView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ApplicationPagination

    def get_queryset(self):
        candidate_id = self.kwargs['candidate_id']
        return Application.objects.filter(candidate_id=candidate_id).order_by('-date')


class ApplicationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
