from django.db import models
from user.models import Candidate, Company
from django.utils import timezone


class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    salary = models.CharField(max_length=255, default="Thương lượng")
    status = models.CharField(max_length=100, default="Activated")
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    post_date = models.DateTimeField(default=timezone.now)


class Application(models.Model):
    date = models.DateField()
    status = models.CharField(max_length=100)
    resume = models.TextField()
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
