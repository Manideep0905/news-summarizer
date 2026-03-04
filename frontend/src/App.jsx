import { Link } from "react-router-dom";

function App() {

    return (
        <div className="flex flex-col justify-center items-center gap-10 min-h-full">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl dark:text-white">Welcome to news summarizer</h1>
            <Link 
                to={"/articles/form"}
                className="px-2 py-1 text-md md:px-3.5 md:py-1.5 md:text-lg lg:px-4 lg:py-2 lg:text-xl border dark:text-white dark:hover:text-black dark:hover:bg-gray-200 duration-200 cursor-pointer"
            >
                Start →
            </Link>
        </div>
    );
}

export default App;
