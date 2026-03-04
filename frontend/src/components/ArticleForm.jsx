import { useState } from "react";
import { Link } from "react-router-dom";

function ArticleForm() {

    const [category, setCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-10 justify-center items-center">
                <input 
                    type="text" 
                    className="p-4 dark:text-white border w-xs text-xs sm:w-sm sm:text-sm md:w-md md:text-md lg:w-xl lg:text-lg"
                    placeholder="Enter your news interest (e.g, technology, gaming)" 
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />

                <Link to={`/articles/${category}`}
                    className="text-sm p-2 md:text-md lg:text-lg dark:text-white border dark:hover:bg-gray-200 dark:hover:text-black duration-200 cursor-pointer"
                >
                    Fetch articles
                </Link>
            </form>
        </div>
    )
}

export default ArticleForm
