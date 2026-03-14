import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoDark from "../assets/logoDark.png";

function Header() {

    const authStatus = useSelector((state) => {
        return state.authSlice.status;
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        const logoutUrl = "http://localhost:8000/api/users/logout";

        const response = await fetch(logoutUrl, {
            method: "POST",
            credentials: "include"
        });

        let data;
        try {
            data = await response.json();
        }
        catch {
            data = null;
        }

        if (response.ok) {
            dispatch(logout());
            toast.success("Logged out", {
                style: {
                    background: "#333",
                    color: "#fff"
                },
                position: "bottom-center"
            });
        }

        navigate("/");
        setIsMenuOpen(false);
    }

    return (
        <header className="shadow sticky top-0 z-50">
            <nav className="dark:bg-black dark:text-white px-4 py-3">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
                    <div className="flex justify-start">
                        <Link
                            to="/"
                            className=""
                        >
                            <img src={logoDark} className="object-contain w-auto h-8" alt="logo" />
                        </Link>
                    </div>
                    {
                        authStatus &&
                            <div className="hidden sm:justify-between sm:items-center sm:flex sm:w-auto">
                                <ul className="flex mt-4 font-medium sm:flex-row sm:space-x-8 sm:mt-0">
                                    <li>
                                        <NavLink
                                            to="/"
                                            className={({isActive}) =>
                                                `${isActive ? "text-orange-700 dark:text-white hover:text-orange-700 dark:hover:text-white" : "text-gray-700 dark:text-gray-500"} block py-2 px-3 duration-200 hover:bg-gray-50 dark:hover:bg-transparent hover:text-orange-700 dark:hover:text-gray-300`
                                            }
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/my-articles"
                                            className={({isActive}) =>
                                                `${isActive ? "text-orange-700 dark:text-white hover:text-orange-700 dark:hover:text-white" : "text-gray-700 dark:text-gray-500"} block py-2 px-3 duration-200 hover:bg-gray-50 dark:hover:bg-transparent hover:text-orange-700 dark:hover:text-gray-300`
                                            }
                                        >
                                            My articles
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                    }
                    {
                        !authStatus ?  
                            <div className="hidden sm:flex sm:items-center">
                                <Link
                                    to="/login"
                                    className="text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-transparent dark:hover:opacity-90 font-medium text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-white dark:text-white bg-orange-700 dark:bg-gray-700 hover:bg-orange-800 dark:hover:bg-gray-700 dark:hover:opacity-90 font-medium text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
                                >
                                    Register
                                </Link>
                            </div>
                            :
                            <div className="hidden sm:flex sm:items-center sm:justify-end">
                                <button
                                    className="text-white dark:text-white bg-orange-700 dark:bg-gray-700 hover:bg-orange-800 dark:hover:bg-gray-700 dark:hover:opacity-90 font-medium text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none cursor-pointer"
                                    onClick={logoutHandler}
                                >
                                    Logout
                                </button>
                            </div>
                    }
                    <div className="flex items-center sm:hidden">

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-gray-500 cursor-pointer">
                            <span className="-inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMenuOpen ? "hidden" : ""} size-6`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true">
                                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <svg className={`${isMenuOpen ? "" : "hidden"} size-6`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true">
                                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className="sm:hidden absolute right-2 top-5/6 mt-3 space-y-3 px-4 py-3 dark:bg-black text-center">

                                {authStatus && (
                                    <Link
                                        to="/my-articles"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block dark:text-gray-300 dark:hover:text-white"
                                    >
                                        My Articles
                                    </Link>
                                )}

                                {!authStatus ? (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                        <button
                                            onClick={logoutHandler}
                                            className="block dark:text-gray-300 dark:hover:text-white cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;
