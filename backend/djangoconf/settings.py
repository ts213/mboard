from dotenv import dotenv_values
from django.core.cache import cache
from pathlib import Path

env = dotenv_values('../.env') or dotenv_values('.env')
assert len(env) > 0, 'error loading .env file'

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_DIR = BASE_DIR.parent

DEBUG = env.get('DEBUG') == 'True'

SECRET_KEY = env.get('SECRET_KEY')

ALLOWED_HOSTS = env.get('ALLOWED_HOSTS').split()

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
    'UNAUTHENTICATED_USER': None,  # if django.contrib.auth is disabled

    'EXCEPTION_HANDLER': 'board.utils.custom_exception_handler',
}
if env.get('USE_THROTTLE') == 'True':
    REST_FRAMEWORK.update({
        'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle', ],
        'DEFAULT_THROTTLE_RATES': {'anon': env.get('DEFAULT_THROTTLE'), },
    })

INSTALLED_APPS = [
    # 'django.contrib.admin',
    # 'django.contrib.auth',
    'django.contrib.contenttypes',
    # 'django.contrib.sessions',
    # 'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'board.apps.BoardConfig',
]

# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

MIDDLEWARE = [
    'django.middleware.common.CommonMiddleware',
]

if DEBUG:
    INTERNAL_IPS = ['localhost', '192.168.1.133']  # debug toolbar
    INSTALLED_APPS.insert(-1, 'debug_toolbar')
    MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')

ROOT_URLCONF = 'djangoconf.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 'DIRS': ['dist'],
        'APP_DIRS': True,
        # 'OPTIONS': {
        #     # 'context_processors': [
        #     #     'django.template.context_processors.debug',
        #     #     'django.template.context_processors.request',
        #     #     # 'django.contrib.auth.context_processors.auth',
        #     #     # 'django.contrib.messages.context_processors.messages',
        #     #     # "django.template.context_processors.request",
        #     # ],
        # },
    },
]

WSGI_APPLICATION = 'djangoconf.wsgi.application'

DATABASES = {
    'default': {
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': BASE_DIR / 'db.sqlite3',
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env.get('DB_NAME'),
        'USER': env.get('DB_USER'),
        'PASSWORD': env.get('DB_PASS'),
        # 'HOST': '127.0.0.1',
        'HOST': env.get('DB_HOST'),
        'PORT': '5432',
    }
}

CACHES = {
    "default": {
        # "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "BACKEND": "board.redis_cache_customized.RedisCache",
        # "LOCATION": "redis://127.0.0.1:6379",
        # "LOCATION": "redis://redis:6379",
        "LOCATION": env.get('REDIS_HOST'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# STATICFILES_DIRS = [
#     BASE_DIR.parent / 'dist/assets',
# ]

MEDIA_ROOT = MEDIA_DIR / 'media/'
MEDIA_URL = '/media/'

# UPLOADED_FILES_USE_URL = False

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
