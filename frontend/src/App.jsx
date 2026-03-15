import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api/axios.js";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice.js";

function App() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/api/users/me");
                dispatch(login(res.data));
            }
            catch { 
                dispatch(logout());
                navigate("/");
            }
        }

        checkAuth();
    }, []);

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
