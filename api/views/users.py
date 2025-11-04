import logging
from typing import Annotated

from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from jwt.exceptions import InvalidTokenError

from models import UserData, ChangePasswordRequest
from database.connect import get_db
from database.models import User
from utils.jwt_manager import verify_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token/")
logger = logging.getLogger(__name__)
router = APIRouter()


async def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)],
        db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token)
        print('PayLoad', payload)
        username = payload.get("email")
        if username is None:
            raise credentials_exception

    except InvalidTokenError:
        raise credentials_exception

    stmt = select(User).where(User.email == username)
    user = db.scalars(stmt).one_or_none()

    if user is None:
        raise credentials_exception

    return user


@router.get("/users/me/", response_model=UserData)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return UserData(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        status=current_user.status,
        birth_date=current_user.birth_date,
        height=current_user.height,
        body_type=current_user.body_type,
        gender=current_user.gender,
        city_id=current_user.city_id
    )


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
