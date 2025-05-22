from django.apps import AppConfig

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    # Removed database query from ready() to avoid accessing DB during app initialization
    def ready(self):
        pass
