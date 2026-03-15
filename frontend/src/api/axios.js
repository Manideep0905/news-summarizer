import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    async error => {

        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/users/refresh")
        ) {

            originalRequest._retry = true;

            try {
                await api.post("/api/users/refresh");
                return api(originalRequest);
            } catch {

                // only redirect to /login if request was protected.
                if (!originalRequest.url.includes("/articles")) {
                    return Promise.reject(error);
                }
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
