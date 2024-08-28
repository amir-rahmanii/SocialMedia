import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const apiRequest = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:4002",
});

// Request interceptor to add the access token to the headers
apiRequest.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("access-token"); // Get stored access token
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Set in header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle refresh token logic
apiRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 409 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get("refresh-token");

            if (refreshToken) {
                try {
                    const response = await apiRequest.post(`users/refresh-token`, { refreshToken });
                    const newAccessToken = response.data.response.accessToken;
                    Cookies.set("access-token", newAccessToken); // Set new access token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiRequest(originalRequest); // Retry the original request with the new token
                } catch (error) {
                    // If the refresh token fails, log the user out and redirect to the login page
                    Cookies.remove("access-token");
                    Cookies.remove("refresh-token");
                    toast.error("Session expired. Please log in again.");

                    // Redirect to login page
                    window.location.href = "/login"; // Ensure this is the correct route to your login page
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiRequest;
