
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_URL = 'static/'

# Central static folder
STATICFILES_DIRS = [
    BASE_DIR / "static",  
]

# Directory for collected static files during deploymen
STATIC_ROOT = BASE_DIR / "staticfiles"