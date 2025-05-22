from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    USER_LEVEL_CHOICES = [
        ('admin', 'Admin'),
        ('librarian', 'Librarian'),
        ('student', 'Student'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_level = models.CharField(max_length=20, choices=USER_LEVEL_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.get_user_level_display()}"

@receiver(post_save, sender=UserProfile)
def update_user_superuser_status(sender, instance, **kwargs):
    user = instance.user
    if instance.user_level in ['librarian', 'admin']:
        user.is_staff = True
        user.is_superuser = True
    else:
        user.is_staff = False
        user.is_superuser = False
    user.save()

class Student(models.Model):
    student_id = models.CharField(max_length=11, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=11)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('BOOK', 'Book'),
        ('MAGAZINE', 'Magazine'),
        ('NEWSPAPER', 'Newspaper'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BORROWED', 'Borrowed'),
    ]

    resource_id = models.CharField(max_length=20, unique=True, primary_key=True)
    title = models.CharField(max_length=200)
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES)
    author = models.CharField(max_length=100)
    publication_year = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='AVAILABLE')

    def __str__(self):
        return f"{self.title} ({self.resource_id})"

class Borrow(models.Model):
    borrow_id = models.CharField(max_length=20, unique=True)
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('RETURNED', 'Returned'),
        ('OVERDUE', 'Overdue'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')

    def clean(self):
        # Check if resource is already borrowed
        if self.status == 'ACTIVE' and Borrow.objects.filter(
            resource=self.resource,
            status='ACTIVE'
        ).exclude(pk=self.pk).exists():
            raise ValidationError('This resource is already borrowed by another student')

        # Check if student has unreturned books
        if self.status == 'ACTIVE' and Borrow.objects.filter(
            student=self.student,
            status='ACTIVE'
        ).exclude(pk=self.pk).exists():
            raise ValidationError('This student has unreturned books and cannot borrow more')

    def save(self, *args, **kwargs):
        self.full_clean()
        is_new = self.pk is None
        
        # Update resource status when borrowing
        if is_new and self.status == 'ACTIVE':
            self.resource.status = 'BORROWED'
            self.resource.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} borrowed {self.resource}"

class Return(models.Model):
    borrow_record = models.ForeignKey(Borrow, on_delete=models.CASCADE, limit_choices_to={'status': 'ACTIVE'})
    return_date = models.DateField(auto_now_add=True)
    condition_notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Update borrow record status
        self.borrow_record.status = 'RETURNED'
        self.borrow_record.save()
        
        # Update resource status
        self.borrow_record.resource.status = 'AVAILABLE'
        self.borrow_record.resource.save()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Return of {self.borrow_record.resource} by {self.borrow_record.student}"

class Report(models.Model):
    REPORT_TYPES = [
        ('BORROW', 'Borrow Records'),
        ('RETURN', 'Return Records'),
        ('OVERDUE', 'Overdue Items'),
    ]
    
    report_type = models.CharField(max_length=10, choices=REPORT_TYPES)
    generated_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()
    file = models.FileField(upload_to='reports/', blank=True)

    def __str__(self):
        return f"{self.get_report_type_display()} Report ({self.start_date} to {self.end_date})"


class Resource(models.Model):
    RESOURCE_TYPES = [
        ('BOOK', 'Book'),
        ('MAGAZINE', 'Magazine'),
        ('NEWSPAPER', 'Newspaper'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('BORROWED', 'Borrowed'),
    ]

    resource_id = models.CharField(max_length=20, unique=True, primary_key=True)
    title = models.CharField(max_length=200)
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES)
    author = models.CharField(max_length=100)
    publication_year = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='AVAILABLE')

    def __str__(self):
        return f"{self.title} ({self.resource_id})"

class Borrow(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('RETURNED', 'Returned'),
        ('OVERDUE', 'Overdue'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
    borrow_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')

    def clean(self):
        # Check if resource is already borrowed
        if self.status == 'ACTIVE' and Borrow.objects.filter(
            resource=self.resource,
            status='ACTIVE'
        ).exclude(pk=self.pk).exists():
            raise ValidationError('This resource is already borrowed by another student')

        # Check if student has unreturned books
        if self.status == 'ACTIVE' and Borrow.objects.filter(
            student=self.student,
            status='ACTIVE'
        ).exclude(pk=self.pk).exists():
            raise ValidationError('This student has unreturned books and cannot borrow more')

    def save(self, *args, **kwargs):
        self.full_clean()
        is_new = self.pk is None
        
        # Update resource status when borrowing
        if is_new and self.status == 'ACTIVE':
            self.resource.status = 'BORROWED'
            self.resource.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} borrowed {self.resource}"

class Return(models.Model):
    borrow_record = models.ForeignKey(Borrow, on_delete=models.CASCADE, limit_choices_to={'status': 'ACTIVE'})
    return_date = models.DateField(auto_now_add=True)
    condition_notes = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Update borrow record status
        self.borrow_record.status = 'RETURNED'
        self.borrow_record.save()
        
        # Update resource status
        self.borrow_record.resource.status = 'AVAILABLE'
        self.borrow_record.resource.save()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Return of {self.borrow_record.resource} by {self.borrow_record.student}"

class Report(models.Model):
    REPORT_TYPES = [
        ('BORROW', 'Borrow Records'),
        ('RETURN', 'Return Records'),
        ('OVERDUE', 'Overdue Items'),
    ]
    
    report_type = models.CharField(max_length=10, choices=REPORT_TYPES)
    generated_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()
    file = models.FileField(upload_to='reports/', blank=True)

    def __str__(self):
        return f"{self.get_report_type_display()} Report ({self.start_date} to {self.end_date})"
