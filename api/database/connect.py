from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from config import DATABASE_NAME
from database.models import Base


engine = create_engine(f"sqlite:///database/{DATABASE_NAME}.db", echo=True)
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
# from sqlalchemy.orm import sessionmaker

# Асинхронное подключение
# async_engine = create_async_engine(f"sqlite:///database/{DATABASE_NAME}.db")
# AsyncSessionLocal = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


# async def init_db():
#     async with async_engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)


# async def get_session():
#     async with AsyncSessionLocal() as session:
#         try:
#             yield session
#         finally:
#             await session.close()
