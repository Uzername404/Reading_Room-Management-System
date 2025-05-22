from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Drop all tables related to the api app'

    def handle(self, *args, **kwargs):
        tables = [
            'api_report',
            'api_resource',
            'api_student',
            'api_borrow',
            'api_return',
            'api_userprofile',
        ]
        with connection.cursor() as cursor:
            for table in tables:
                try:
                    cursor.execute(f"DROP TABLE IF EXISTS {table};")
                    self.stdout.write(self.style.SUCCESS(f"Successfully dropped table {table}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error dropping table {table}: {e}"))
