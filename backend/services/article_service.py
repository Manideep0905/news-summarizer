from models.article import Article

async def save_article_for_user(user, body, summary=None, bias=None):

    article = await Article.find_one(Article.article_url == body.article_url)

    # if article already exists
    if article:
        if article.article_url in user.saved_articles and not summary and not bias:
            return {"message": "Article already saved"}

        if summary:
            article.summary = summary
        if bias:
            article.bias = bias
        await article.save()
    else:
        article = Article(
            title=body.title,
            description=body.description,
            image_url=body.image_url,
            source=body.source,
            article_url=body.article_url,
            summary=summary,
            bias=bias
        )
        await article.insert()

    # save reference in user
    if article.article_url not in user.saved_articles:
        user.saved_articles.append(article.article_url)
        await user.save()

    return {
        "title": article.title,
        "image": article.image_url,
        "summary": article.summary,
        "bias": article.bias
    }
