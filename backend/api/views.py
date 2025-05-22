from rest_framework import generics
from django.contrib.auth.models import User
from .models import Student, Resource, Borrow, Return
from .serializers import StudentSerializer, ResourceSerializer, BorrowSerializer, ReturnSerializer, UserRegistrationSerializer, UserSerializer
from .filters import StudentFilter, ResourceFilter
from .permissions import IsLibrarian, IsStudent
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class ReadOnlyOrIsLibrarian(BasePermission):
    """
    The request is authenticated as a librarian/admin for unsafe methods,
    or is a read-only request for authenticated users.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        else:
            user = request.user
            if not user or not user.is_authenticated:
                return False
            if hasattr(user, 'profile') and user.profile.user_level in ['librarian', 'admin']:
                return True
            return False

# Student CRUD
class StudentListCreate(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_class = StudentFilter
    search_fields = ['first_name', 'last_name', 'email', 'student_id']
    ordering_fields = ['first_name', 'last_name', 'email', 'student_id']
    permission_classes = [AllowAny]

class StudentRetrieveUpdate(generics.RetrieveUpdateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]

# Resource CRUD
class ResourceListCreate(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filterset_class = ResourceFilter
    search_fields = ['title', 'author', 'resource_id']
    ordering_fields = ['title', 'author', 'status', 'resource_type']
    permission_classes = [AllowAny]

class ResourceRetrieveUpdate(generics.RetrieveUpdateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]

# Borrow CRUD (optional)
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.core.exceptions import ValidationError as DjangoValidationError

from django_filters.rest_framework import DjangoFilterBackend

class BorrowListCreate(generics.ListCreateAPIView):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    search_fields = ['student__name', 'resource__title']
    ordering_fields = ['borrow_date', 'return_date']
    permission_classes = [AllowAny]

    import logging
    logger = logging.getLogger(__name__)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating borrow record: {e}", exc_info=True)
            raise

# Return CRUD (optional)
class ReturnListCreate(generics.ListCreateAPIView):
    queryset = Return.objects.all()
    serializer_class = ReturnSerializer
    search_fields = ['student__name', 'resource__title']
    ordering_fields = ['return_date']
    permission_classes = [AllowAny]

# User CRUD
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Student CRUD
class StudentListCreate(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_class = StudentFilter
    search_fields = ['first_name', 'last_name', 'email', 'student_id']
    ordering_fields = ['first_name', 'last_name', 'email', 'student_id']
    permission_classes = [AllowAny]

from rest_framework import generics
from django.contrib.auth.models import User
from .models import Student, Resource, Borrow, Return
from .serializers import StudentSerializer, ResourceSerializer, BorrowSerializer, ReturnSerializer, UserRegistrationSerializer
from .filters import StudentFilter, ResourceFilter
from .permissions import IsLibrarian, IsStudent
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class ReadOnlyOrIsLibrarian(BasePermission):
    """
    The request is authenticated as a librarian/admin for unsafe methods,
    or is a read-only request for authenticated users.
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        else:
            user = request.user
            if not user or not user.is_authenticated:
                return False
            if hasattr(user, 'profile') and user.profile.user_level in ['librarian', 'admin']:
                return True
            return False

# Student CRUD
class StudentListCreate(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_class = StudentFilter
    search_fields = ['first_name', 'last_name', 'email', 'student_id']
    ordering_fields = ['first_name', 'last_name', 'email', 'student_id']
    permission_classes = [AllowAny]

class StudentRetrieveUpdate(generics.RetrieveUpdateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]

# Resource CRUD
class ResourceListCreate(generics.ListCreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    filterset_class = ResourceFilter
    search_fields = ['title', 'author', 'resource_id']
    ordering_fields = ['title', 'author', 'status', 'resource_type']
    permission_classes = [AllowAny]

class ResourceRetrieveUpdate(generics.RetrieveUpdateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]

# Borrow CRUD (optional)
class BorrowListCreate(generics.ListCreateAPIView):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    search_fields = ['student__name', 'resource__title']
    ordering_fields = ['borrow_date', 'return_date']
    permission_classes = [AllowAny]

# Return CRUD (optional)
class ReturnListCreate(generics.ListCreateAPIView):
    queryset = Return.objects.all()
    serializer_class = ReturnSerializer
    search_fields = ['student__name', 'resource__title']
    ordering_fields = ['return_date']
    permission_classes = [AllowAny]

# Custom TokenObtainPairSerializer to include user_level in token claims
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        if hasattr(user, 'profile'):
            token['user_level'] = user.profile.user_level
        else:
            token['user_level'] = 'student'  # default or fallback

        return token

# Custom TokenObtainPairView using the custom serializer
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = [AllowAny]

class MyTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

class MyTokenBlacklistView(TokenBlacklistView):
    permission_classes = [AllowAny]

# Removed UserRegistrationView as registration is disabled; only admin can add users
