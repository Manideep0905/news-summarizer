import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    async error => {

        const dispatch = useDispatch();

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/users/refresh")) {

            originalRequest._retry = true;

            try {
                await api.post("/api/users/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                dispatch(logout());
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
