from rest_framework import serializers
from .models import User, Candidate, Company

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CandidateRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Candidate
        fields = ['email', 'password', 'firstname', 'lastname', 'birthday','gender']

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data.pop('password')  # Remove the password field
        
        user = User.objects.create_user(email=email, password=password, role = 'candidate')
        active = 'True'
        candidate = Candidate.objects.create(user=user, active = active, **validated_data)
        return candidate

class CompanyRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Company
        fields = ['name', 'password', 'address', 'email', 'field']

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data.pop('password')  # Remove the password field
        
        user = User.objects.create_user(email=email, password=password, role = 'company')
        active = 'True'
        company = Company.objects.create(user=user, active = active, **validated_data)
        return company
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Custom validation logic, if needed

        return data