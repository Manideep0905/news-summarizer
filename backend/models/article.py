from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class Article(Document):
    title: str
    description: Optional[str]
    image_url: Optional[str]
    source: str
    summary: Optional[List[str]] = []
    bias: Optional[str] = None

    article_url: str = Indexed(unique=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "articles"

