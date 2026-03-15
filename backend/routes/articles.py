from datetime import datetime
from beanie import Save
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR
from core.config import settings
import httpx
from newspaper import Article as NewsArticle
from beanie.odm.operators.find.logical import Or
from beanie.operators import In
from models.user import User
from models.article import Article
from routes.users import get_current_user
from schemas.articles import SaveArticleRequest, SummaryRequest
from services.article_service import save_article_for_user
from utils.summarizer import summarize_article

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
        article = NewsArticle(article_url)
        article.download()
        article.parse()
    except Exception as e:
        print("Scraping error", e)
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


@router.get("/saved-articles")
async def get_saved_articles(current_user=Depends(get_current_user)):

    user = await User.get(current_user.id)

    if not user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User not found")

    articles = await Article.find(
        In(Article.article_url, user.saved_articles)
    ).to_list()

    return articles


@router.get("/saved-articles-ids")
async def saved_articles_ids(current_user=Depends(get_current_user)):

    user = await User.get(current_user.id)

    if not user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User not found")

    article_urls = user.saved_articles

    return [ article_url for article_url in article_urls ]


@router.post("/summarize")
async def summarize(body: SummaryRequest, current_user=Depends(get_current_user)):

    user = await User.get(current_user.id)

    if not user:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="User not found")

    description = body.description

    if not description:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Article description required")

    article = await Article.find_one(Article.article_url == body.article_url)

    if article and article.summary and article.bias:
        return {
            "title": article.title,
            "image": article.image_url,
            "summary": article.summary,
            "bias": article.bias
        }

    result = await summarize_article(body.description)

    if not result:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="AI summarization failed")

    summary = result.get("summary", [])
    bias = result.get("bias", "Unknown")

    result = await save_article_for_user(user, body, summary, bias)

    return result


@router.post("/save-article")
async def save_article(body: SaveArticleRequest, current_user=Depends(get_current_user)):
    
    user = await User.get(current_user.id)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    await save_article_for_user(user, body)
    return {
        "message": "Article saved successfully"
    }


@router.delete("/remove-article")
async def remove_article(article_url: str, current_user=Depends(get_current_user)):
    
    user = await User.get(current_user.id)

    if article_url in user.saved_articles:
        user.saved_articles.remove(article_url)
        await user.save()

    return {"message": "Article removed"}


@router.get("/{category}")
async def get_articles(
        category: str
):
    url = "https://newsapi.org/v2/top-headlines"

    params = {
        "apiKey": settings.NEWSAPI_API_KEY,
        "category": category,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Failed to fetch news articles")

    data = response.json()
    articles = data.get("articles", [])

    return [
        {
            "title": article["title"],
            "description": article["description"],
            "image_url": article["urlToImage"],
            "source": article["source"]["name"],
            "article_url": article["url"],
            "summary": "TODO"
        }
        for article in articles
    ]
