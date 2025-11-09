from typing import List, Optional

from datetime import date, datetime, timezone

from passlib.hash import pbkdf2_sha256
from sqlalchemy import ForeignKey, String, Enum as SQLEnum, Index, UniqueConstraint, JSON
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from constants import BodyType, Gender, Status, PhotoType


class Base(DeclarativeBase):
    pass


class AuthToken(Base):
    __tablename__ = "auth_tokens"
    __table_args__ = (Index('idx_token_active', 'token', 'is_active'),)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    token: Mapped[str] = mapped_column(primary_key=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(back_populates="auth_tokens")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(user_id={self.user_id!r})"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(30))
    password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    birth_date: Mapped[date]
    height: Mapped[int]
    body_type: Mapped[BodyType] = mapped_column(SQLEnum(BodyType))
    gender: Mapped[Gender] = mapped_column(SQLEnum(Gender))
    city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"))
    status: Mapped[Status] = mapped_column(SQLEnum(Status), default=Status.PENDING)
    device_info: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    last_login: Mapped[datetime] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

    auth_tokens: Mapped["AuthToken"] = relationship(back_populates="user")
    city: Mapped["City"] = relationship(back_populates="users")
    photos: Mapped[List["Photo"]] = relationship(back_populates="user")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id!r}, name={self.name!r})"

    def set_password(self, password: str) -> None:
        self.password = pbkdf2_sha256.hash(password)

    def verify_password(self, password: str) -> bool:
        return pbkdf2_sha256.verify(password, self.password)


class City(Base):
    __tablename__ = "cities"
    __table_args__ = (
        Index('idx_cities_name', 'name'),
        UniqueConstraint('name', 'region', name='uq_city_region')
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    region: Mapped[str] = mapped_column(String(50), nullable=False)

    users: Mapped[List["User"]] = relationship(back_populates="city")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id!r}, name={self.name!r}, region={self.region!r})"

    @property
    def full_name(self):
        return f"{self.name}, {self.region}"


class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    file_path: Mapped[str] = mapped_column(String(500))
    photo_type: Mapped[PhotoType] = mapped_column(SQLEnum(PhotoType), default=PhotoType.GALLERY)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

    user: Mapped["User"] = relationship(back_populates="photos")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self.id!r}, photo_type={self.photo_type!r})"
