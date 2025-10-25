from pydantic import BaseModel, Field, field_validator, EmailStr, ValidationError
from datetime import date
from typing import Optional
import re
from constants import BodyType, Gender


class RegistrationForm(BaseModel):
    email: EmailStr = Field(min_length=2, max_length=100, description="Email пользователя")
    name: str = Field(min_length=2, max_length=30, description="Имя пользователя")
    birth_date: date = Field(description="Дата рождения")
    height: int = Field(ge=100, le=250, description="Рост в сантиметрах")
    body_type: BodyType = Field(description="Тип телосложения")
    gender: Gender = Field(description="Пол")
    city_id: int = Field(description="Город")

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


class VerificationForm(BaseModel):
    user_id: int
    avatar: str
    verification_photo: str


external_data = {\
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

