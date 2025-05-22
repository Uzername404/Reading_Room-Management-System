from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile

class Command(BaseCommand):
    help = 'Create a UserProfile with user_level admin for a given username if it does not exist'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to create profile for')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        try:
            user = User.objects.get(username=username)
            profile, created = UserProfile.objects.get_or_create(user=user)
            if created:
                profile.user_level = 'admin'
                profile.save()
                self.stdout.write(self.style.SUCCESS(f"UserProfile created with user_level 'admin' for user '{username}'"))
            else:
                self.stdout.write(self.style.WARNING(f"UserProfile already exists for user '{username}'"))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' does not exist"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
