from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()


class Candidate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.CharField(max_length=255, default="https://firebasestorage.googleapis.com/v0/b/careerconnect-5ad6c.appspot.com/o/candidates%2Fsample.png?alt=media")
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    birthday = models.DateField()
    address = models.CharField(max_length=200)
    gender = models.CharField(max_length=10)
    resumes = ArrayField(models.TextField(), null=True, blank=True)
    status = models.CharField(max_length=100, default="Activated")


class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    logo = models.CharField(max_length=255, default="https://firebasestorage.googleapis.com/v0/b/careerconnect-5ad6c.appspot.com/o/companies%2Fsample.png?alt=media")
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    field = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    description = models.TextField()
    status = models.CharField(max_length=100, default="Activated")


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    adminname = models.CharField(max_length=100)
