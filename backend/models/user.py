from beanie import Document, Indexed, PydanticObjectId
from pydantic import EmailStr, Field
from typing import List, Optional
from datetime import datetime


class User(Document):
    first_name: str
    last_name: str

    username: str = Indexed(unique=True)
    email: str = Indexed(unique=True)

    hashed_password: str

    refresh_token: Optional[str] = None

    saved_articles: List[PydanticObjectId] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"  # This is the collection name.
