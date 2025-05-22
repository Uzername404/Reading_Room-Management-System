from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile

class Command(BaseCommand):
    help = 'Set user profile user_level to admin for a given username'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of the user to update')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        try:
            user = User.objects.get(username=username)
            profile = user.profile
            profile.user_level = 'admin'
            profile.save()
            self.stdout.write(self.style.SUCCESS(f"User '{username}' profile user_level set to 'admin'"))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' does not exist"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
