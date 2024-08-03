from rest_framework import serializers

from user.serializers import CandidateSerializer
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):
    num_applications = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_num_applications(self, obj):
        return Application.objects.filter(job=obj).count()


class ApplicationSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
