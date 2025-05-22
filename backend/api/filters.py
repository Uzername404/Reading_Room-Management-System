import django_filters
from .models import Student, Resource

class StudentFilter(django_filters.FilterSet):
    class Meta:
        model = Student
        fields = {
            'student_id': ['exact', 'icontains'],
            'first_name': ['exact', 'icontains'],
            'last_name': ['exact', 'icontains'],
            'email': ['exact', 'icontains'],
            'phone': ['exact'],
        }

class ResourceFilter(django_filters.FilterSet):
    class Meta:
        model = Resource
        fields = {
            'resource_id': ['exact', 'icontains'],
            'title': ['exact', 'icontains'],
            'author': ['exact', 'icontains'],
            'resource_type': ['exact'],
            'status': ['exact'],
        }
