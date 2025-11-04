import os 
import logging
from pathlib import Path
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


# SMTP MAIL
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


DATABASE_NAME = os.getenv("DATABASE_NAME")
LIMIT_CITY_ENTITIES_FOR_SEARCH = 5
LOG_LEVEL = logging.INFO

STORAGE_DIR = Path('storage/')
STORAGE_UPLOADS = STORAGE_DIR / 'uploads'
STORAGE_UPLOADS.mkdir(parents=True, exist_ok=True)

# JWT
@dataclass
class JWTSettings:
    algorithm: str = 'HS256'
    secret_key: str = os.getenv("SECRET_KEY")
    access_token_expire_minutes: int = 10

