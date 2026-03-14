import { useEffect, useState } from "react";
import api from "../api/axios.js";

function MyArticlesPage() {

    const [savedArticles, setSavedArticles] = useState([]);

    useEffect(async () => {
        try {
            const response = await api.get("/api/articles/saved-articles");
            setSavedArticles(response.data);
        }
        catch (err) {
            console.log("Error fetching saved articles", err);
        }
    }, []);
    return (
        <>
        </>
    )
}

export default MyArticlesPage;
