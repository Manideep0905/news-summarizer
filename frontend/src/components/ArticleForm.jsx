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
                    placeholder="Enter your news interest" 
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />

                <Link to={`/articles/${category}`}
                    className="text-sm p-2 md:text-md lg:text-lg dark:text-white border dark:hover:bg-gray-200 dark:hover:text-black duration-200 cursor-pointer"
                >
                    Fetch articles
                </Link>

                <div className="flex justify-start w-full">
                    <p className="dark:text-gray-200 text-sm sm:text-lg">
                        Example categories:
                        <span>
                            <li>business</li>
                            <li>entertainment</li>
                            <li>general</li>
                            <li>health</li>
                            <li>science</li>
                            <li>sports</li>
                            <li>technology</li>
                        </span>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default ArticleForm
