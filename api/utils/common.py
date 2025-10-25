import secrets
import string
import json
from typing import List, Dict

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database.connect import engine
from database.models import City


def generate_password(length: int = 8) -> str:
    if length < 4:
        raise ValueError("Длина пароля должна быть не менее 4 символов")
    
    characters = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password


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

# update_cities_table_from_json_bulk('cities.json')

