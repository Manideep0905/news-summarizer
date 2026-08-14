import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const[errorMsg, setErrorMsg] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const loginUrl = `${import.meta.env.VITE_API_URL}/api/users/login`;

        const loginInfo = {
            emailOrUsername: emailOrUsername,
            password: password
        }

        // try {
        //     const response = await axios.post(loginUrl, loginInfo);
        //     console.log(response.data);
        // }
        // catch (err) {
        //     if (err.response) {
        //         console.log(err.response.data.detail);
        //     }
        // }

        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(loginInfo)
        });

        let data;
        try {
            data = await response.json();
        }
        catch {
            data = null;
        }

        setLoading(false);

        if (!response.ok) {
            if (Array.isArray(data?.detail)) {
                setErrorMsg(data.detail[0].msg);
            } else {
                setErrorMsg(data?.detail || "Login failed");
            }
            return;
        }

        setErrorMsg("");
        toast.success("Login successful", {
            style: {
                background: "#333",
                color: "#fff"
            },
            position: "bottom-center"
        });

        dispatch(login(data));
        navigate("/");
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-800 dark:text-white p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="w-56 sm:w-64 md:w-72 lg:w-96 mx-auto">

                {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

                <div className="mb-5 flex flex-col">
                    <label className="block mb-2.5 text-sm font-medium">Email or Username</label>
                        <input 
                            type="text" 
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="p-2 border"
                            placeholder="Enter your email or username"
                        />
                </div>
                <div className="mb-5 flex flex-col">
                    <label className="block mb-2.5 text-sm font-medium">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border" 
                            placeholder="Enter your password" 
                        />
                </div>
                <button 
                    type="submit" 
                    className="mt-2 w-20 border p-2 hover:bg-black dark:hover:bg-gray-200 dark:hover:text-black hover:text-white duration-200 cursor-pointer"
                >
                    {
                        loading ? 
                        <div className="flex h-full justify-center items-center">
                            <svg className="h-5 w-5 animate-spin" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        :
                        <p>Login</p>
                    }
                </button>
            </form>
        </div>
    )
}

export default Login;
