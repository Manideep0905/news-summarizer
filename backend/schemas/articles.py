from pydantic import BaseModel

class SaveArticleRequest(BaseModel):
    title: str
    description: str
    image_url: str
    source: str
    article_url: str

class SummaryRequest(BaseModel):
    title: str
    description: str
    article_url: str
