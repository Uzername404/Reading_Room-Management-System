from django.utils.deprecation import MiddlewareMixin
from django.views.decorators.csrf import csrf_exempt

class CsrfExemptMiddleware(MiddlewareMixin):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        if request.path.startswith('/api/'):
            return csrf_exempt(callback)(request, *callback_args, **callback_kwargs)
        return None
