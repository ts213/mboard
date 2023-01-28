from django.apps import AppConfig


class JourneyappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'journeyapp'

    def ready(self):
        from . import signals  # noqa
