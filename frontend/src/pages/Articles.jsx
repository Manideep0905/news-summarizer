import api from "../api/axios.js";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "../components/index.js";
import { useSelector } from "react-redux";

function Articles() {

    const { category } = useParams();
    const [articlesArr, setArticlesArr] = useState([]);
    const [savedArticlesArr, setSavedArticlesArr] = useState([]);
    const [loading, setLoading] = useState(true);
    const authStatus = useSelector(state => state.authSlice.status);
    const [savingArticle, setSavingArticle] = useState(null);

    const fetchArticles = async () => {
        try {
            const response = await api.get(`/api/articles/${category}`);
            if (authStatus === true) {
                const res = await api.get("/api/articles/saved-articles-ids");
                setSavedArticlesArr(res.data);
            }
            setArticlesArr(response.data);
        }
        catch (error) {
            console.error("Error while fetching the articles", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArticles();
    }, [category]);

    const handleSave = async (article) => {

        if (savedArticlesArr.includes(article.article_url)) return;

        setSavingArticle(article.article_url);

        try {
            const payload = {
                title: article.title,
                description: article.description,
                image_url: article.image_url,
                source: article.source,
                article_url: article.article_url,
            }

            await api.post("/api/articles/save-article", payload);

            // update the "save" button to "saved" when a particular article is saved.
            setSavedArticlesArr(prev => [...prev, article.article_url]);
        }
        catch (error) {
            console.error("Error saving article", error);
        }
        finally {
            setSavingArticle(null);
        }
    }

    if (loading) {
        return <Spinner className={`flex justify-center items-center h-screen`} />
    }

    return (
        <div className="bg-white dark:bg-gray-700 w-screen">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-10">
                    {`${category.replace(category.charAt(0), category.charAt(0).toUpperCase())} articles`}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">

                    {
                        articlesArr.map((article, index) => (
                            <div key={index} className={`${loading ? "animation-pulse" : ""} group relative bg-gray-800 p-8 overflow-hidden flex flex-col h-full`}>
                                <img
                                    src={article.image_url}
                                    className="aspect-square w-full bg-gray-200 object-cover lg:aspect-auto lg:h-80"
                                />
                                <div className="flex flex-col flex-1 p-4">
                                    <h3 className="dark:text-white font-bold text-xl mb-4">{article.title}</h3>
                                    <p 
                                        className="mt-4 dark:text-white text-lg overflow-hidden"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical"
                                        }}
                                    >
                                        {article.description}
                                    </p>
                                    <p className="mt-4 dark:text-gray-300 text-md">Source: {article.source}</p>
                                </div>
                                {
                                    authStatus ?
                                        <div className="p-4 flex justify-between">
                                            <Link 
                                                className="inline-block w-fit dark:bg-indigo-500 p-1 text-sm lg:p-2 lg:text-lg dark:text-white cursor-pointer"
                                                to={`/articles/detail?url=${encodeURIComponent(article.article_url)}`}
                                                state={{
                                                    title: article.title,
                                                    description: article.description,
                                                    image_url: article.image_url,
                                                    source: article.source,
                                                    article_url: article.article_url
                                                }}
                                            >
                                                Detailed view
                                            </Link>
                                            <Link
                                                className="inline-block w-fit dark:bg-blue-600 p-1 text-sm lg:p-2 lg:text-lg dark:text-white cursor-pointer"
                                                to={`/articles/summary?url=${encodeURIComponent(article.article_url)}`}
                                                state={{
                                                    title: article.title,
                                                    description: article.description,
                                                    image_url: article.image_url,
                                                    source: article.source,
                                                    article_url: article.article_url
                                                }}
                                            >
                                                Summarize
                                            </Link>
                                            {
                                                savedArticlesArr.includes(article.article_url) ? (
                                                    <button
                                                        className="inline-block w-fit dark:bg-gray-600 p-1 text-sm lg:p-2 lg:text-lg dark:text-white cursor-pointer"
                                                        disabled={true}
                                                    >
                                                        Saved
                                                    </button>
                                                ) : (
                                                        <button
                                                            className="inline-block w-fit dark:bg-green-600 p-1 text-sm lg:p-2 lg:text-lg dark:text-white cursor-pointer"
                                                            onClick={() => handleSave(article)}
                                                        >
                                                        {
                                                            savingArticle === article.article_url ? 
                                                            <div className="flex h-full justify-center items-center">
                                                                <svg className="h-5 w-10 animate-spin" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            </div>
                                                            :
                                                            <p>Save</p>
                                                        }
                                                        </button>
                                                    )
                                            }
                                        </div>
                                        :
                                        <div className="p-4 flex justify-between">
                                            <Link 
                                                className="inline-block w-fit dark:bg-indigo-500 p-1 text-sm lg:p-2 lg:text-lg dark:text-white cursor-pointer"
                                                to={`/articles/detail?url=${encodeURIComponent(article.article_url)}`}
                                                state={{
                                                    title: article.title,
                                                    description: article.description,
                                                    image_url: article.image_url,
                                                    source: article.source,
                                                    article_url: article.article_url
                                                }}
                                            >
                                                Detailed view
                                            </Link>
                                        <div className="flex items-center">
                                            <p className="dark:text-orange-400 text-lg">Login to view summaries</p>
                                        </div>
                                        </div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Articles;
