import axios from "axios";
import { getBackendApiUrl } from "./getBackendUrl";

const axiosInstance = axios.create();

// Use smart backend URL resolver
axiosInstance.defaults.baseURL = getBackendApiUrl();
axiosInstance.defaults.withCredentials = true;

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Bypass-Tunnel-Reminder"] = "true";
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("authState");
      // Redirect to login if not already there
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;