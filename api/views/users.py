import logging
import secrets
import shutil
import string
from typing import Annotated, List
from urllib.parse import urljoin
from pathlib import Path

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, status, Depends, Request, UploadFile, File
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload, selectinload


from constants import ALLOWED_PHOTO_EXTENSIONS, PhotoType, MAX_PHOTOS
from database.connect import get_db
from database.models import Photo, User, AuthToken
from utils.common import calculate_age, generate_password
from utils.email_sender import send_password
from schemas import UserData, ChangePasswordRequest, UserEditForm, ResetPasswordRequest
from config import STORAGE_UPLOADS


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login/")
logger = logging.getLogger(__name__)
router = APIRouter()


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> User:
    print('Token', token)
    stmt = select(AuthToken).where(AuthToken.token == token, AuthToken.is_active.is_(True))
    auth_token = db.scalars(stmt).one_or_none()
    if not auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный токен авторизации",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Получаем пользователя
    user_stmt = (
        select(User)
        .options(
            joinedload(User.city),
            selectinload(User.photos)
        )
        .where(User.id == auth_token.user_id)
    )

    user = db.scalars(user_stmt).unique().one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )

    return user


def get_user_data(request: Request, user: User) -> UserData:
    avatar = ''
    photos = []
    base_url = str(request.base_url)
    for img in user.photos:
        full_path = urljoin(base_url, img.file_path)
        if img.photo_type == PhotoType.AVATAR:
            avatar = full_path
        elif img.photo_type == PhotoType.VERIFICATION:
            continue
        photos.append(full_path)

    return UserData(
        id = user.id,
        email = user.email,
        name = user.name,
        age = calculate_age(user.birth_date),
        status = user.status,
        height = user.height,
        body_type = user.body_type,
        gender = user.gender,
        city = user.city.full_name,
        city_id = user.city_id,
        avatar = avatar,
        photos = photos,
        bio = user.bio,
        desires = user.desires,
    )


@router.get("/users/me/", response_model=UserData)
async def read_users_me(request: Request, user: Annotated[User, Depends(get_current_user)]):
    return get_user_data(request, user)


@router.post("/users/edit/", response_model=UserData)
async def edit_user(request: Request, form: UserEditForm, user: Annotated[User, Depends(get_current_user)], db: Session = Depends(get_db)):  
    user.name = form.name
    user.city_id = form.city_id
    user.height = form.height
    user.body_type = form.body_type
    user.bio = form.bio
    user.desires = form.desires
    db.commit()
    db.refresh(user)
    return get_user_data(request, user)


@router.post("/users/change_password/")
async def change_password(password_data: ChangePasswordRequest, db: Session = Depends(get_db)):
    stmt = select(User).where(User.email == password_data.email)
    user = db.scalars(stmt).one_or_none()

    if not user or not user.verify_password(password_data.old_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password"
        )

    user.set_password(password_data.new_password)
    db.commit()

    return {
        "success": True,
        "message": "Пароль успешно изменен",
    }


@router.post("/users/reset_password/")
async def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    stmt = select(User).where(User.email == data.email)
    user = db.scalars(stmt).one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь с таким email не найден"
        )

    new_password = generate_password()
    print("NEW PWD", new_password) # Удалить
    user.set_password(new_password)
    db.commit()

    await send_password(user.email, new_password)

    return {
        "success": True,
        "message": "Новый пароль сгенерирован и отправлен на email",
    }


@router.post("/users/photos/upload/")
async def upload_profile_photos(
    current_user: Annotated[User, Depends(get_current_user)],
    photos: List[UploadFile] = File(..., description="Фотографии профиля"),
    db: Session = Depends(get_db)
):
    if len(photos) + len(current_user.photos) > MAX_PHOTOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Максимальное количество фото: {MAX_PHOTOS - 1}"
        )

    user_id = current_user.id
    user_dir = STORAGE_UPLOADS / f'user_{user_id}'
    user_dir.mkdir(parents=True, exist_ok=True)

    uploaded_photos = []

    try:
        for i, photo in enumerate(photos):
            photo_ext = Path(photo.filename).suffix.lower()
            if not photo_ext or photo_ext not in ALLOWED_PHOTO_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Не допустимый формат файла: {photo.filename}"
                )

            random_suffix = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(8))
            photo_filename = f"profile_photo_{user_id}_{i}_{random_suffix}{photo_ext}"
            photo_path = user_dir / photo_filename

            with open(photo_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)

            db_photo = Photo(
                user_id=user_id,
                file_path=str(photo_path),
                photo_type=PhotoType.PENDING
            )
            db.add(db_photo)
            uploaded_photos.append(str(photo_path))

        # # Коммитим все изменения
        db.commit()

        return {
            "success": True,
            "message": f"Успешно загружено {len(uploaded_photos)} фото",
            "user_id": user_id,
            "uploaded_photos": uploaded_photos,
        }

    except Exception as e:
        for photo_path in uploaded_photos:
            try:
                Path(photo_path).unlink(missing_ok=True)
            except:
                pass
        db.rollback()
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при загрузке фото: {str(e)}"
        )
