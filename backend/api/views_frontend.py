from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os

class FrontendAppView(View):
    """
    Serves the compiled frontend app (index.html) for all non-API routes.
    """
    def get(self, request, *args, **kwargs):
        try:
            with open(os.path.join(settings.FRONTEND_DIR, 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            return HttpResponse(
                "index.html not found! Please build your frontend app.",
                status=501,
            )
