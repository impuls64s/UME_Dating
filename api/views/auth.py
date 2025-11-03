import logging
import json
import time
import shutil
from pathlib import Path

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from constants import ALLOWED_PHOTO_EXTENSIONS, PhotoType
from config import STORAGE_UPLOADS
from models import RegistrationForm, VerificationForm
from database.connect import engine
from database.models import User, Photo


router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/registration/", status_code=status.HTTP_201_CREATED)
def registration(form: RegistrationForm):
    try:
        with Session(engine) as session:
            stmt = select(User).where(User.email == form.email)
            existing_user = session.scalars(stmt).one_or_none()
            if existing_user:
                logger.warning(f'Пользователь с email <{form.email}> уже существует')
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Пользователь с таким email уже существует",
                )

            # Создаем пользователя
            user_dict = form.model_dump()
            user = User(**user_dict)
            session.add(user)
            session.commit()
            session.refresh(user)

    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ошибка при создании пользователя. Возможно есть совпадающие уникальные данные."
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Внутренняя ошибка сервера при регистрации"
        )

    return {
        "success": True,
        "user_id": user.id,
        "message": "Пользователь успешно зарегистрирован",
    }


@router.post("/verification/")
async def verification(
    user_id: int = Form(..., description="ID Пользователя"),
    avatar: UploadFile = File(..., description="Основное фото профиля"),
    verification_photo: UploadFile = File(..., description="Фото для верификации"),
):
    user_dir = STORAGE_UPLOADS / f'user_{user_id}'
    user_dir.mkdir(parents=True, exist_ok=True)

    avatar_ext = Path(avatar.filename).suffix.lower()
    verification_photo_ext = Path(verification_photo.filename).suffix.lower()

    if not avatar_ext or not verification_photo_ext:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось определить формат файлов."
        )

    if avatar_ext not in ALLOWED_PHOTO_EXTENSIONS or verification_photo_ext not in ALLOWED_PHOTO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не допустимый формат файлов."
        )

    avatar_filename = f"avatar_user_id_{user_id}{avatar_ext}"
    verification_filename = f"verification_user_id_{user_id}{verification_photo_ext}"

    avatar_path = user_dir / avatar_filename
    verification_path = user_dir / verification_filename

    with open(avatar_path, "wb") as buffer:
        shutil.copyfileobj(avatar.file, buffer)

    with open(verification_path, "wb") as buffer:
        shutil.copyfileobj(verification_photo.file, buffer)

    with Session(engine) as session:
        a_photo = Photo(user_id=user_id, file_path=str(avatar_path), photo_type=PhotoType.AVATAR)
        v_photo = Photo(user_id=user_id, file_path=str(verification_path), photo_type=PhotoType.VERIFICATION)
        session.add_all([a_photo, v_photo])
        session.commit()

    return {
        "status": "success",
        "message": "Фото успешно загружены",
        "avatar_path": str(avatar_path),
        "verification_path": str(verification_path),
        "user_id": user_id
    }


