from pathlib import Path
import environ
from datetime import timedelta

# path to root directory and read environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(str(BASE_DIR / '.env'))

# secret key and debug mode
SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=False)

# allowed hosts
ALLOWED_HOSTS = ["*"]

# application definition
INSTALLED_APPS = [
    # default django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # custom apps
    'accounts',
    'establishments',
    'menu',

    # third-party apps
    'phonenumber_field',
    'rest_framework',
    'django_redis',
    'corsheaders',
    'django_filters',
    'whitenoise',

    # authentication apps
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]

MIDDLEWARE = [
    # default django middleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # third-party middleware
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
]

ROOT_URLCONF = 'restaurants.urls'

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
            ],
        },
    },
]

WSGI_APPLICATION = 'restaurants.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# development database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# production database
# DATABASES = {
#     'default': {
#         'ENGINE': env('DB_ENGINE'),
#         'NAME': env('DB_NAME'),
#         'USER': env('DB_USER'),
#         'PASSWORD': env('DB_PASSWORD'),
#         'HOST': env('DB_HOST'),
#         'PORT': env('DB_PORT'),
#     }
# }

# password validation
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

# internationalization
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# static files (CSS, JavaScript, Images) and Media files (Images, Videos, etc.)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# static files storage using Whitenoise for production
if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# custom user model
AUTH_USER_MODEL = 'accounts.User'

# phone number field settings
PHONENUMBER_DB_FORMAT = 'E164'
PHONENUMBER_DEFAULT_REGION = 'VN'

# email settings
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
EMAIL_PORT = env.int('EMAIL_PORT')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS')
EMAIL_BACKEND = env('EMAIL_BACKEND')

# cache settings
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{env('REDIS_HOST')}:{env('REDIS_PORT')}/{env('REDIS_DB')}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

# REST framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

# simple jwt settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),  # Thời gian sống của refresh token
    'ROTATE_REFRESH_TOKENS': True,  # Tự động tạo refresh token mới khi refresh
    'BLACKLIST_AFTER_ROTATION': True,  # Đưa refresh token cũ vào blacklist
}

# authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# OAuth2 settings
# google OAuth2 settings
OAUTH2_GOOGLE_KEY = env("OAUTH2_GOOGLE_KEY")
OAUTH2_GOOGLE_SECRET = env("OAUTH2_GOOGLE_SECRET")
OAUTH2_GOOGLE_SCOPE = env.list("OAUTH2_GOOGLE_SCOPE", default=[
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
])
OAUTH2_GOOGLE_REDIRECT_URI = env("OAUTH2_GOOGLE_REDIRECT_URI")

# facebook OAuth2 settings
OAUTH2_FACEBOOK_KEY = env("OAUTH2_FACEBOOK_KEY")
OAUTH2_FACEBOOK_SECRET = env("OAUTH2_FACEBOOK_SECRET")
OAUTH2_FACEBOOK_SCOPE = env.list("OAUTH2_FACEBOOK_SCOPE", default=[
    "email", "public_profile"
])
OAUTH2_FACEBOOK_REDIRECT_URI = env("OAUTH2_FACEBOOK_REDIRECT_URI")

# github OAuth2 settings
OAUTH2_GITHUB_KEY = env("OAUTH2_GITHUB_KEY")
OAUTH2_GITHUB_SECRET = env("OAUTH2_GITHUB_SECRET")
OAUTH2_GITHUB_REDIRECT_URI = env("OAUTH2_GITHUB_REDIRECT_URI")
OAUTH2_GITHUB_SCOPE = env.list("OAUTH2_GITHUB_SCOPE", default=[
    "read:user", "user:email"
])

# CORS settings
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # React app
]
"""
COOP is a security policy that prevents documents from being embedded in other documents.
We need to set it to None for OAuth2 to open popup windows.
"""
SECURE_CROSS_ORIGIN_OPENER_POLICY = None


