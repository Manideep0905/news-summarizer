import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const[errorMsg, setErrorMsg] = useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const registerUrl = "http://localhost:8000/api/users/register";

        const registerInfo = {
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
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

        const response = await fetch(registerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(registerInfo)
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
                setErrorMsg(data?.detail || "Registration failed");
            }
            return;
        }

        setErrorMsg("");
        toast.success("User registered", {
            style: {
                background: "#333",
                color: "#fff"
            },
            position: "bottom-center"
        });
        navigate("/");
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-800 dark:text-white p-10 shadow-lg">
            <form onSubmit={handleSubmit} className="w-60 sm:w-80 lg:w-96 mx-auto">

                {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

                <div className="mb-5 flex flex-col">
                    <label className="block mb-2.5 text-sm font-medium">First name</label>
                        <input 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="p-2 border"
                            placeholder="Enter your first name"
                        />
                </div>
                <div className="mb-5 flex flex-col">
                    <label className="block mb-2.5 text-sm font-medium">Last name</label>
                        <input 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="p-2 border"
                            placeholder="Enter your last name"
                        />
                </div>
                <div className="mb-5 flex flex-col">
                    <label className="block mb-2.5 text-sm font-medium">Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-2 border" 
                            placeholder="Enter your username" 
                        />
                </div>
                <div className="mb-5 flex flex-col">
                    <label className="block mb-2.5 text-sm font-medium">Email</label>
                        <input 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border"
                            placeholder="Enter your email"
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
                <button type="submit" className="mt-2 w-20 border p-2 hover:bg-black dark:hover:bg-gray-200 dark:hover:text-black hover:text-white duration-200 cursor-pointer">Register</button>
            </form>
        </div>
    )
}

export default Register;
