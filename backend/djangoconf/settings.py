from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = 'django-insecure-ms_1(dc*(xcc@)n!ryq=laphhsx!t$x85(vtfc%!_8@)y&=x3q'

DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', '192.168.1.133', 'localhost']

INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    "192.168.1.133",
]

# DEBUG_TOOLBAR_CONFIG = {
#     "SHOW_TOOLBAR_CALLBACK": lambda request: True,
# }

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ]
}

# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",
# ]

# CORS_ALLOW_ALL_ORIGINS = True

# CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 3rd party
    'rest_framework',
    "debug_toolbar",
    # 'corsheaders',
    # local
    'journeyapp.apps.JourneyappConfig',
]

# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    # "corsheaders.middleware.CorsMiddleware",
    # 'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'djangoconf.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = 'djangoconf.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

MEDIA_ROOT = MEDIA_DIR / 'media'
MEDIA_URL = '/media/'

# UPLOADED_FILES_USE_URL = False

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
