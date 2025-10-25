import logging
from typing import Union

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select, collate, func
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models import RegistrationForm
from database.connect import engine
from database.models import City
from config import LIMIT_CITY_ENTITIES_FOR_SEARCH


router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/cities/", status_code=status.HTTP_200_OK)
def cities_list():
    items = []
    with Session(engine) as session:
        stmt = select(City).order_by(City.name.asc())
        cities = session.scalars(stmt).all()
        for city in cities:
            items.append({"id": city.id, "name": city.full_name})

    return {
        "success": True,
        "items": items,
    }


@router.get("/cities/search", status_code=status.HTTP_200_OK)
def search_for_cities(q: Union[str, None] = None):
    items = []
    with Session(engine) as session:
        word = q.strip().capitalize()
        stmt = select(City).where(City.name.ilike((f'{word}%'))).order_by(City.name.asc()).limit(LIMIT_CITY_ENTITIES_FOR_SEARCH)
        cities = session.scalars(stmt).all()
        for city in cities:
            items.append({"id": city.id, "name": city.full_name})

    return {
        "success": True,
        "items": items,
    }
