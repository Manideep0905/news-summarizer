import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";
import { Spinner } from "../components/index.js";

function MyArticlesPage() {

    const [savedArticles, setSavedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedArticles = async () => {
            try {
                const response = await api.get("/api/articles/saved-articles");
                setSavedArticles(response.data);
            }
            catch (err) {
                console.log("Error fetching saved articles", err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchSavedArticles();
    }, []);

    const handleRemove = async (article) => {
        try {
            await api.delete("/api/articles/remove-article", {
                params: { article_url: article.article_url }
            });

            setSavedArticles(prev => prev.filter(a => a.article_url !== article.article_url));
        }
        catch (err) {
            console.log("Error while removing article", err);
        }
    }

    if (loading) {
        return <Spinner className={`flex justify-center items-center h-screen`} />
    }

    if (savedArticles.length === 0) {
        return (
            <p className="dark:text-gray-200 text-xl">
                No articles to show.
            </p>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-700 w-screen">
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-10">
                    My Articles
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">

                    {
                        savedArticles.map((article, index) => (
                            <div key={index} className={`${loading ? "animation-pulse" : ""} group relative bg-gray-800 p-8 overflow-hidden flex flex-col h-full`}>
                                <img
                                    src={article.image_url}
                                    className="aspect-square w-full bg-gray-200 object-cover lg:aspect-auto lg:h-80"
                                />
                                <div className="flex flex-col flex-1 p-4">
                                    <h3 className="dark:text-white font-bold text-xl mb-4">{article.title}</h3>
                                    <p className="mt-4 dark:text-white text-lg">{article.description}</p>
                                    <p className="mt-4 dark:text-gray-300 text-md">Source: {article.source}</p>
                                </div>
                                <div className="p-4 flex justify-between">
                                    <Link 
                                        className="inline-block w-fit dark:bg-indigo-500 p-1 text-sm lg:p-2 lg:text-lg dark:text-white cursor-pointer"
                                        to={`/articles/detail?url=${encodeURIComponent(article.article_url)}`}
                                    >
                                        Detailed view
                                    </Link>
                                    <Link
                                        className="inline-block w-fit dark:bg-blue-600 dark:text-white p-1 text-sm lg:p-2 lg:text-lg cursor-pointer"
                                        to={`/articles/summary?url=${encodeURIComponent(article.article_url)}`}
                                    >
                                        Summarize
                                    </Link>
                                    <button
                                        className="inline-block w-fit dark:bg-red-600 dark:text-white p-1 text-sm lg:p-2 lg:text-lg cursor-pointer"
                                        onClick={() => handleRemove(article)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default MyArticlesPage;
