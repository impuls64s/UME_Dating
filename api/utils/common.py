import secrets
import string
import json
from datetime import date
from typing import List, Dict

from sqlalchemy.orm import Session

from database.connect import engine
from database.models import City


def generate_password(length: int = 8) -> str:
    if length < 8:
        raise ValueError("Длина пароля должна быть не менее 8 символов")
    
    characters = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password


def generate_auth_token() -> str:
    return secrets.token_urlsafe(32)


def calculate_age(birth_date: date) -> int:
    today = date.today()
    age = today.year - birth_date.year
    if today < birth_date.replace(year=today.year):
        age -= 1
    return age


def update_cities_table_from_json_bulk(path: str):
    with open(path, 'r', encoding='utf-8') as file:
        cities_data: List[Dict] = json.load(file)

    with Session(engine) as session:
        cities_to_add = []
        
        for city_item in cities_data:
            city = City(name=city_item['city'].strip(), region=city_item['region'].strip())
            cities_to_add.append(city)

        if cities_to_add:
            session.add_all(cities_to_add)
            session.commit()
        
        print(f'Добавлено в БД городов: {len(cities_to_add)}')


# Не забыть закомментировать
# update_cities_table_from_json_bulk('cities.json')

