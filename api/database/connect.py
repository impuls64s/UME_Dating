from sqlalchemy import create_engine, event

from config import DATABASE_NAME
from database.models import Base


engine = create_engine(f"sqlite:///database/{DATABASE_NAME}.db", echo=True)
Base.metadata.create_all(engine)
