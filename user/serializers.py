from rest_framework import serializers
from .models import User, Candidate, Company, Admin


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class CandidateRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    firstname = serializers.CharField()
    lastname = serializers.CharField()
    birthday = serializers.DateField()
    gender = serializers.CharField()

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email=email, password=password, role="candidate"
        )
        candidate = Candidate.objects.create(user=user, **validated_data)
        return candidate


class CompanyRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    name = serializers.CharField()
    field = serializers.CharField()
    address = serializers.CharField()
    description = serializers.CharField()

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email=email, password=password, role="company"
        )
        company = Company.objects.create(user=user, **validated_data)
        return company


class AdminCreateSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    adminname = serializers.CharField()

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email=email, password=password, role="admin"
        )
        admin = Admin.objects.create(user=user, **validated_data)
        return admin


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # Custom validation logic, if needed

        return data


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'
        extra_kwargs = {
            'resume': {'required': False},
            'user': {'required': False},
            'active': {'required': False}
        }


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
