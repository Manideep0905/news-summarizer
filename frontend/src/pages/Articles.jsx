import axios from "axios";
import { API_BASE_URL } from "../util.js";
import { useParams } from "react-router-dom";
import { useState } from "react";

function Articles() {

    const { category } = useParams();
    const [articlesArr, setArticlesArr] = useState([]);

    const fetchArticles = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/articles/${category}`);
            setArticlesArr(response.data.articles);
        }
        catch (error) {
            console.error("Error while fetching the articles", error);
        }
    }

    return (
        <div>
            <h3>This is the articles page, where all the articles are shown</h3>
            <button onClick={fetchArticles}>Fetch Articles</button>
            {
                articlesArr.map((article, idx) => (
                    <div key={idx}>
                        <h2>{article.title}</h2>
                        <p>{article.description}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Articles;
