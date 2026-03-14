import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const[errorMsg, setErrorMsg] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginUrl = "http://localhost:8000/api/users/login";

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
                <button type="submit" className="mt-2 w-20 border p-2 hover:bg-black dark:hover:bg-gray-200 dark:hover:text-black hover:text-white duration-200 cursor-pointer">Login</button>
            </form>
        </div>
    )
}

export default Login;
