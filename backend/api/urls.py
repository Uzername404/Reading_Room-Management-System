from django.urls import path
from .views import (
    StudentListCreate, StudentRetrieveUpdate,
    ResourceListCreate, ResourceRetrieveUpdate,
    BorrowListCreate, ReturnListCreate,
    UserList, UserDetail,
    MyTokenObtainPairView, MyTokenRefreshView, MyTokenBlacklistView,
    # UserRegistrationView,  # Removed as registration is disabled
)

urlpatterns = [
    path('students/', StudentListCreate.as_view()),
    path('students/<int:pk>/', StudentRetrieveUpdate.as_view()),
    path('resources/', ResourceListCreate.as_view()),
    path('resources/<str:pk>/', ResourceRetrieveUpdate.as_view()),
    path('borrows/', BorrowListCreate.as_view()),
    path('returns/', ReturnListCreate.as_view()),
    path('users/', UserList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', MyTokenBlacklistView.as_view(), name='token_blacklist'),
    # path('register/', UserRegistrationView.as_view(), name='user_registration'),  # Removed
]
