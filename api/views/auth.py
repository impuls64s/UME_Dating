import logging
import shutil
from pathlib import Path
from typing import Annotated

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from utils.common import generate_password
from utils.email_sender import send_password
from constants import ALLOWED_PHOTO_EXTENSIONS, PhotoType
from config import STORAGE_UPLOADS
from models import RegistrationForm, Token
from database.connect import get_db
from database.models import User, Photo
from utils.jwt_manager import create_access_token


logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/registration/", status_code=status.HTTP_201_CREATED)
async def registration(form: RegistrationForm, db: Session = Depends(get_db)):
    try:
        stmt = select(User).where(User.email == form.email)
        existing_user = db.scalars(stmt).one_or_none()
        if existing_user:
            logger.warning(f'Пользователь с email <{form.email}> уже существует')
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким email уже существует",
            )

        # Создаем пользователя
        user_dict = form.model_dump()
        user = User(**user_dict)
        db.add(user)
        db.commit()
        db.refresh(user)

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
    db: Session = Depends(get_db)
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

    stmt = select(User).where(User.id == user_id)
    user = db.scalars(stmt).one_or_none()
    if not user:
        shutil.rmtree(user_dir)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Пользователь с ID = {user_id} отсутсвует."
        )

    password = generate_password()
    print(f'PASSWORD: {password}')  # Удалить
    user.set_password(password)
    await send_password(user.email, password)

    a_photo = Photo(user_id=user_id, file_path=str(avatar_path), photo_type=PhotoType.AVATAR)
    v_photo = Photo(user_id=user_id, file_path=str(verification_path), photo_type=PhotoType.VERIFICATION)
    db.add_all([a_photo, v_photo])
    db.commit()

    return {
        "status": "success",
        "message": "Фото успешно загружены",
        # "avatar_path": str(avatar_path),
        # "verification_path": str(verification_path),
        "user_id": user_id
    }


@router.get("/verification/status/{user_id}")
async def get_verification_status(user_id: int, db: Session = Depends(get_db)):
    stmt = select(User).where(User.id == user_id)
    user = db.scalars(stmt).one_or_none()
    if user:
        return {"user_id": user_id, "status": user.status}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Пользователь с ID = {user_id} отсутсвует."
    )


@router.post("/token/")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
) -> Token:
    stmt = select(User).where(User.email == form_data.username)
    user = db.scalars(stmt).one_or_none()
    if not user or not user.verify_password(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = {"sub": user.id, "email": user.email, "status": user.status}
    access_token = create_access_token(payload)
    return Token(access_token=access_token, token_type="bearer")
