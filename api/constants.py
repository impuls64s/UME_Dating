
from enum import Enum

class BodyType(str, Enum):
    AVERAGE = "average"
    SLIM = "slim"
    ATHLETIC = "athletic"
    FULL = "full"
    MUSCULAR = "muscular"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"


class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BANNED = "banned"
    PENDING = "pending"
    REJECTED = "rejected"
    DELETED = "deleted"


ALLOWED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']


class PhotoType(str, Enum):
    AVATAR = "avatar"
    GALLERY = "gallery"
    VERIFICATION = "verification"
