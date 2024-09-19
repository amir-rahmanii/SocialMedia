import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const apiRequest = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4002", // Use your actual base URL here
});

// Request interceptor to add the access token to the headers
apiRequest.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access-token"); // Retrieve access token from cookies
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Set token in headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle access token expiry and refresh logic
apiRequest.interceptors.response.use(
  (response) => {
    return response; // Return response if successful
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Token expired, try refreshing
    if (error.response?.status === 409 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh-token");

      if (refreshToken) {
        try {
          // Attempt to refresh the access token
          const response = await apiRequest.post(`/users/refresh-token`, { refreshToken });
          const newAccessToken = response.data.response.accessToken;
          
          // Set new access token and retry original request
          Cookies.set("access-token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiRequest(originalRequest); // Retry original request with new token
        } catch (error) {
          // Refresh token failed, log out user and clear tokens
          // handleSessionExpired();
        }
      } else {
        // handleSessionExpired();
      }
    }

    return Promise.reject(error); // Return error if it's not handled above
  }
);

// Handle session expiration (logout user and redirect)
// const handleSessionExpired = () => {
//   Cookies.remove("access-token");
//   Cookies.remove("refresh-token");
//   toast.error("Session expired. Please log in again.");
//   setTimeout(() => {
//     window.location.href = "/login"; // Adjust this route to your app's login page
//   }, 1500); // Delay to show toast before redirect
// };

export default apiRequest;
