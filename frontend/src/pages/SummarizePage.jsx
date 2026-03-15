import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { useState, useEffect } from "react";

function SummarizePage() {

    const [searchParams] = useSearchParams();
    const articleUrl = searchParams.get("url");
    const [detailedArticle, setDetailedArticle] = useState({});
    const [summarizedArticle, setSummarizedArticle] = useState({});
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

            await getSummarizedArticle(response.data);
        }
        catch (error) {
            console.log("Error while fetching detailed article", error);
            setError("The website does not allow scraping");
        }
    }

    const getSummarizedArticle = async (article) => {
        try {
            const payload = {
                title: article.title,
                description: article.text,
                article_url: articleUrl
            }
            const response = await api.post("/api/articles/summarize", payload);
            setSummarizedArticle(response.data);
        }
        catch (error) {
            console.log("Error while generating AI summary", error);
            setError("Error while generating AI summary");
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
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="dark:text-white text-xl after:content-[''] after:animate-dotLoop">Generating AI summary</p>
            </div>
        )
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 px-10 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">{summarizedArticle.title}</h1>

                {summarizedArticle.image && (
                    <img
                        src={summarizedArticle.image}
                        alt={summarizedArticle.title}
                        className="w-full h-80 object-cover rounded-lg mb-6"
                    />
                )}

                <h3 className="text-3xl font-bold dark:text-white mt-10 mb-5">Summary:</h3>
                {Array.isArray(summarizedArticle.summary) && (
                    <ul className="list-disc pl-6 space-y-2 text-lg">
                        {summarizedArticle.summary?.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                )}
                <h4 className="text-2xl font-bold dark:text-white mt-10">Bias Level</h4>
                <span className={
                    `${summarizedArticle.bias === "Low" ? "text-green-500" :
                        summarizedArticle.bias === "Medium" ? "text-yellow-500" : "text-red-500"} text-lg font-bold`
                }>
                    {summarizedArticle.bias}
                </span>
            </div>
        </div>
    )
}

export default SummarizePage;
