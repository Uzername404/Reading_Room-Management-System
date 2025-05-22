from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Student, Resource, Borrow, Return, Report, UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_level']
    search_fields = ['user__username', 'user_level']

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    search_fields = ['student_id', 'first_name', 'last_name', 'email']
    list_display = ['student_id', 'first_name', 'last_name', 'email']

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    search_fields = ['resource_id', 'title', 'author', 'resource_type']
    list_display = ['resource_id', 'title', 'author', 'status']

@admin.register(Borrow)
class BorrowAdmin(admin.ModelAdmin):
    search_fields = ['student__first_name', 'student__last_name', 'resource__title']
    list_display = ['student', 'resource', 'borrow_date']

@admin.register(Return)
class ReturnAdmin(admin.ModelAdmin):
    search_fields = ['borrow_record__student__first_name', 'borrow_record__resource__title']
    list_display = ['borrow_record', 'return_date']

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    search_fields = ['report_type', 'start_date', 'end_date']
    list_display = ['report_type', 'start_date', 'end_date']
