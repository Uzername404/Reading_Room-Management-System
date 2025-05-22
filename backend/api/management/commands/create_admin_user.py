from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile

class Command(BaseCommand):
    help = 'Create an admin user with specified username and password, bypassing password validation'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username for the admin user')
        parser.add_argument('password', type=str, help='Password for the admin user')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        password = kwargs['password']

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f"User '{username}' already exists"))
            return

        user = User.objects.create_user(username=username)
        user.set_password(password)  # Bypass password validation by setting directly
        user.is_staff = True
        user.is_superuser = True
        user.save()

        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.user_level = 'admin'
        profile.save()

        self.stdout.write(self.style.SUCCESS(f"Admin user '{username}' created successfully"))
