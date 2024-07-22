from django.db import models
from user.models import Candidate, Company

class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    salary = models.BigIntegerField()
    status = models.CharField(max_length=100, default="Activated")
    companyId = models.ForeignKey(Company, on_delete=models.CASCADE)

class Application(models.Model):
    date = models.DateField()
    status = models.CharField(max_length=100)
    resume = models.FileField(upload_to='resumes/')
    candidateId = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    jobId = models.ForeignKey(Job, on_delete=models.CASCADE)