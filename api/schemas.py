import re
from datetime import date
from typing import Dict, List, Optional, Any

from fastapi import Form
from pydantic import BaseModel, Field, field_validator, EmailStr, ValidationError, model_validator

from constants import BodyType, Gender, Status


class RegistrationForm(BaseModel):
    email: EmailStr = Field(min_length=2, max_length=100, description="Email пользователя")
    name: str = Field(min_length=2, max_length=30, description="Имя пользователя")
    birth_date: date = Field(description="Дата рождения")
    height: int = Field(ge=100, le=250, description="Рост в сантиметрах")
    body_type: BodyType = Field(description="Тип телосложения")
    gender: Gender = Field(description="Пол")
    city_id: int = Field(description="Город")
    device_info: Dict[str, Any]

    @field_validator('name')
    def validate_name(cls, v):
        if not re.match(r'^[a-zA-Zа-яА-ЯёЁ\s\-]+$', v):
            raise ValueError('Имя может содержать только буквы, пробелы и дефисы')
        return v.strip()

    @field_validator('birth_date')
    def validate_birth_date(cls, v):
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 18:
            raise ValueError('Вам должно быть больше 18 лет')
        if age > 100:
            raise ValueError('Возраст должен быть реалистичным')
        return v


class LoginForm(BaseModel):
    email: EmailStr
    password: str
    # email: str = Form(...),
    # password: str = Form(...),


class Token(BaseModel):
    user_id: int
    token: str


class UserData(BaseModel):
    id: int
    email: EmailStr
    name: str
    age: int
    status: Status
    height: int
    body_type: BodyType
    gender: Gender
    city: str
    city_id: int
    avatar: str
    photos: List[str]
    bio: Optional[str]
    desires: Optional[str]


class UserEditForm(BaseModel):
    name: str
    height: int
    body_type: BodyType
    city_id: int
    bio: Optional[str]
    desires: Optional[str]


class ResetPasswordRequest(BaseModel):
    email: EmailStr


class ChangePasswordRequest(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str
    confirm_password: str

    @field_validator('new_password')
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Пароль должен содержать минимум 8 символов')
        return v

    @field_validator('confirm_password')
    def validate_passwords_match(cls, v, info):
        if 'new_password' in info.data and v != info.data['new_password']:
            raise ValueError('Новые пароли не совпадают')
        return v

    @model_validator(mode='after')
    def validate_different_passwords(self):
        if self.old_password == self.new_password:
            raise ValueError('Новый пароль должен отличаться от старого')
        return self


external_data = {
    "email": '12312das@mail.ru',
    "name": "Анна",
    "birth_date": "1995-05-15",
    "height": 156,
    "body_type": "slim",
    "gender": Gender.MALE,
    "city": "Москва"
}


# user = RegistrationForm(**external_data)
# print(user.model_dump_json())




