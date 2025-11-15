import logging
from typing import Annotated
from urllib.parse import urljoin

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, status, Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from constants import PhotoType
from database.connect import get_db
from database.models import User, AuthToken
from utils.common import calculate_age
from schemas import UserData, ChangePasswordRequest, UserEditForm


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
    user_stmt = select(User).where(User.id == auth_token.user_id)
    user = db.scalars(user_stmt).one_or_none()
    
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
async def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db)
):
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
