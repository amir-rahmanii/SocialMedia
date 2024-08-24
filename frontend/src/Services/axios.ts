import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const apiRequest = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:4002",
})

apiRequest.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("access-token") // get stored access token
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // set in header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.data.status === 409 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get("refresh-token")
            if (refreshToken) {
                try {
                    const response = await apiRequest.post(`users/refresh-token`, { refreshToken });
                    // don't use axious instance that already configured for refresh token api call
                    const newAccessToken = response.data.response.accessToken;
                    Cookies.set("access-token", newAccessToken)  //set new access token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiRequest(originalRequest); //recall Api with new token
                } catch (error) {
                    // Handle token refresh failure
                    // mostly logout the user and re-authenticate by login again
                    toast.error("try again later!!!")
                }
            }
        }
        return Promise.reject(error);
    }
);



export default apiRequest