from fastapi import APIRouter, HTTPException
from core.config import settings
import httpx
from newspaper import Article

router = APIRouter(
    prefix="/articles",
    tags=["articles"]
)

@router.get("/{category}")
async def get_articles(
        category: str
):
    url = "https://newsapi.org/v2/everything"

    params = {
        "apiKey": settings.NEWSAPI_API_KEY,
        "language": "en",
        "q": category,
        "pageSize": 20
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    data = response.json()
    # articles = data.get("articles", [])

    # if not articles:
    #     return {"error": "No articles found"}

    # return articles[0].get("content")

    return data


@router.get("/get-article")
async def get_article():
    results = []

    for article in data["articles"][:3]:
        url = article["url"]

        try:
            news = Article(url)
            news.download()
            news.parse()

            results.append({
                "title": news.title,
                "text": news.text,
                "source": article["source"]["name"]
            })
        except:
            continue

    return results
