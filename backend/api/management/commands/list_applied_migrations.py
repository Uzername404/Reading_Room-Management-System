from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'List applied migrations for the api app'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("SELECT app, name FROM django_migrations WHERE app = 'api';")
            rows = cursor.fetchall()
            if rows:
                self.stdout.write("Applied migrations for 'api' app:")
                for app, name in rows:
                    self.stdout.write(f"- {name}")
            else:
                self.stdout.write("No migrations applied for 'api' app.")
