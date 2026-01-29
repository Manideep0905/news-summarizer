from fastapi import APIRouter, HTTPException, status
from core.config import settings
import httpx
from newspaper import Article

router = APIRouter(
    prefix="/articles",
    tags=["articles"]
)


ARTICLE_CACHE = {}


@router.get("/detail")
async def get_article_detail(article_url: str):

    if article_url in ARTICLE_CACHE:
        return ARTICLE_CACHE[article_url]

    try:
        article = Article(article_url)
        article.download()
        article.parse()
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to scrape article")

    result = {
        "title": article.title,
        "text": article.text,
        "image": article.top_image,
        "authors": article.authors,
        "published_date": str(article.publish_date)
    }

    ARTICLE_CACHE[article_url] = result
    print(ARTICLE_CACHE)
    return result


@router.get("/{category}")
async def get_articles(
        category: str
):
    url = "https://newsapi.org/v2/everything"

    params = {
        "apiKey": settings.NEWSAPI_API_KEY,
        "language": "en",
        "q": category,
        "pageSize": 10
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Failed to fetch news articles")

    data = response.json()
    articles = data.get("articles", [])

    return [
        {
            "id": index,
            "title": article["title"],
            "description": article["description"],
            "image": article["urlToImage"],
            "source": article["source"]["name"],
            "url": article["url"]
        }
        for index, article in enumerate(articles)
    ]
