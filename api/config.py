import logging
from pathlib import Path


DATABASE_NAME = 'dev'
LIMIT_CITY_ENTITIES_FOR_SEARCH = 5
LOG_LEVEL = logging.INFO

STORAGE_DIR = Path('storage/')
STORAGE_UPLOADS = STORAGE_DIR / 'uploads'
STORAGE_UPLOADS.mkdir(parents=True, exist_ok=True)