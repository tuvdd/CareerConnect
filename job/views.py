from rest_framework import generics, permissions, filters
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
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
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobListAPIView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ["title", "description"]
    filterset_class = JobFilter
    search_fields = ["title", "description", "company__name"]



class JobDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]


class JobListByCompanyAPIView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        company_id = self.kwargs['company_id']
        return Job.objects.filter(company_id=company_id)


class ApplicationCreateAPIView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
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


class ApplicationListByCandidateAPIView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        candidate_id = self.kwargs['candidate_id']
        return Application.objects.filter(candidate_id=candidate_id)


class ApplicationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
