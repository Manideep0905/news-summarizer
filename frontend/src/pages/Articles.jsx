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

    const fetchArticles = async () => {
        try {
            const response = await api.get(`/api/articles/${category}`);
            if (authStatus) {
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

        try {
            const payload = {
                title: article.title,
                description: article.description,
                image_url: article.image_url,
                source: article.source,
                article_url: article.article_url,
                summary: article.summary
            }

            await api.post("/api/articles/save-article", payload);

            // update the "save" button to "saved" when a particular article is saved.
            setSavedArticlesArr(prev => [...prev, article.article_url]);
        }
        catch (error) {
            console.error("Error saving article", error);
        }
    }

    if (loading) {
        return <Spinner className={`flex justify-center items-center h-screen`} />
    }

    return (
        <div className="bg-white dark:bg-gray-700">
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
                                    <p className="mt-4 dark:text-white text-lg">{article.description}</p>
                                    <p className="mt-4 dark:text-gray-300 text-md">Source: {article.source}</p>
                                </div>
                                {
                                    authStatus ?
                                        <div className="p-4 flex justify-between">
                                            <Link 
                                                className="inline-block w-fit dark:bg-indigo-500 p-2 dark:text-white text-lg cursor-pointer"
                                                to={`/articles/detail?url=${encodeURIComponent(article.article_url)}`}
                                            >
                                                Detailed view
                                            </Link>
                                            <Link
                                                className="inline-block w-fit dark:bg-blue-600 p-2 dark:text-white text-lg cursor-pointer"
                                            >
                                                Summarize
                                            </Link>
                                            {
                                                savedArticlesArr.includes(article.article_url) ? (
                                                    <Link
                                                        className="inline-block w-fit dark:bg-gray-600 p-2 dark:text-white text-lg cursor-pointer"
                                                    >
                                                        Saved
                                                    </Link>
                                                ) : (
                                                        <Link
                                                            className="inline-block w-fit dark:bg-green-600 p-2 dark:text-white text-lg cursor-pointer"
                                                            onClick={() => handleSave(article)}
                                                        >
                                                            Save
                                                        </Link>
                                                    )
                                            }
                                        </div>
                                        :
                                        <Link 
                                            className="inline-block w-fit dark:bg-indigo-500 p-2 dark:text-white text-lg cursor-pointer"
                                            to={`/articles/detail?url=${encodeURIComponent(article.article_url)}`}
                                        >
                                            Detailed view
                                        </Link>
                                    /*
                                        savedArticlesArr.includes(article.id) ?
                                            <Link
                                                className="inline-block w-fit dark:bg-green-500 p-2 dark:text-white text-lg cursor-pointer"
                                            >
                                                Saved
                                            </Link>
                                            :
                                            <Link
                                                className="inline-block w-fit dark:bg-green-500 p-2 dark:text-white text-lg cursor-pointer"
                                            >
                                                Save
                                            </Link>
                                        */
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
