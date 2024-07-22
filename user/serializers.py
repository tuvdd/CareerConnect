from rest_framework import serializers
from .models import User, Candidate, Company


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class CandidateRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Candidate
        fields = ["email", "password", "firstname", "lastname", "birthday", "gender"]

    def create(self, validated_data):
        email = validated_data.pop("email") # Remove the email field
        password = validated_data.pop("password")  # Remove the password field

        user = User.objects.create_user(
            email=email, password=password, role="candidate"
        )
        candidate = Candidate.objects.create(user=user, **validated_data)
        return candidate


class CompanyRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Company
        fields = ["email", "password", "name",  "field", "address", "description"]

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")  # Remove the password field

        user = User.objects.create_user(email=email, password=password, role="company")
        company = Company.objects.create(user=user, **validated_data)
        return company


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

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'