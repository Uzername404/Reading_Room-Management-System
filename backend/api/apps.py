from django.apps import AppConfig
from django.db import connection

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Disable MySQL strict mode for the current session to avoid migration errors
        with connection.cursor() as cursor:
            cursor.execute("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'STRICT_TRANS_TABLES',''));")
