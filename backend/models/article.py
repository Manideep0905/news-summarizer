from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class Article(Document):
    title: str
    description: Optional[str]
    full_content: str
    summarized_content: str
    image_url: Optional[str]
    source: str

    article_url: str = Indexed(unique=True)

    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "articles"

