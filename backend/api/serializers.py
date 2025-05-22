from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Student, Resource, Borrow, Return, Report

class StudentSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField()

    class Meta:
        model = Student
        fields = ['student_id', 'first_name', 'last_name', 'phone', 'email']

class ResourceSerializer(serializers.ModelSerializer):
    year = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = ['resource_id', 'title', 'resource_type', 'author', 'publication_year', 'status', 'year']

    def get_year(self, obj):
        return obj.publication_year

class BorrowSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(write_only=True)
    resource_id = serializers.CharField(write_only=True)
    student = StudentSerializer(read_only=True)
    resource = ResourceSerializer(read_only=True)

    class Meta:
        model = Borrow
        fields = '__all__'

    def create(self, validated_data):
        student_id = validated_data.pop('student_id')
        resource_id = validated_data.pop('resource_id')
        student = Student.objects.get(student_id=student_id)
        resource = Resource.objects.get(resource_id=resource_id)
        borrow = Borrow.objects.create(student=student, resource=resource, **validated_data)
        return borrow

    borrow_id = serializers.CharField(read_only=True)

class ReturnSerializer(serializers.ModelSerializer):
    borrow_record_id = serializers.CharField(write_only=True)
    borrow_record = BorrowSerializer(read_only=True)

    class Meta:
        model = Return
        fields = '__all__'

    def create(self, validated_data):
        borrow_record_id = validated_data.pop('borrow_record_id')

        # Change this line to use 'id' instead of 'borrow_id'
        borrow_record = Borrow.objects.get(id=borrow_record_id)  # Corrected line

        return Return.objects.create(borrow_record=borrow_record, **validated_data)

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'}, label='Confirm password')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Create UserProfile with default user_level 'librarian'
        from .models import UserProfile
        UserProfile.objects.create(user=user, user_level='librarian')
        return user
