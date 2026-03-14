import api from "../api/axios.js";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "../components/index.js";

function DetailPage() {

    const [searchParams] = useSearchParams();
    const articleUrl = searchParams.get("url");

    const [detailedArticle, setDetailedArticle] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDetailedArticle = async () => {
        try {
            const response = await api.get(
                "/api/articles/detail",
                {
                    params: { article_url: articleUrl }
                }
            );
            setDetailedArticle(response.data);
        }
        catch (error) {
            console.log("Error while fetching detailed article", error);
            setError("The website does not allow scraping");
            return;
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!articleUrl) {
            setError("Invalid article url");
            setLoading(false);
            return;
        }

        fetchDetailedArticle();
    }, [articleUrl]);

    if (loading) {
        return <Spinner className="h-screen flex items-center justify-center" />;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 px-6 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{detailedArticle.title}</h1>

                {detailedArticle.image && (
                    <img
                        src={detailedArticle.image}
                        alt={detailedArticle.title}
                        className="w-full h-80 object-cover rounded-lg mb-6"
                    />
                )}

                <p className="prose prose-invert max-w-none">
                    {detailedArticle.text}
                </p>
            </div>
        </div>
    );
}

export default DetailPage;
