from rest_framework import permissions

class IsLibrarian(permissions.BasePermission):
    """
    Allows access only to users with user_level 'librarian' or 'admin'.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if hasattr(user, 'profile') and user.profile.user_level in ['librarian', 'admin']:
            return True
        return False

class IsStudent(permissions.BasePermission):
    """
    Allows access only to users with user_level 'student' or 'admin'.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if hasattr(user, 'profile') and user.profile.user_level in ['student', 'admin']:
            return True
        return False
