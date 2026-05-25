import axios from "axios";
import { clearDashboardSession, readDashboardToken } from "../src/utils/secureSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.khaleeaapp.com/api/v1";
const APP_CLIENT_KEY = import.meta.env.VITE_APP_CLIENT_KEY;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-auth-mode": "cookie",
  },
});

// Request interceptor to add shared client headers
api.interceptors.request.use(
  (config) => {
    if (APP_CLIENT_KEY) {
      config.headers["x-app-client-key"] = APP_CLIENT_KEY;
    }
    const dashboardToken = readDashboardToken();
    if (dashboardToken) {
      config.headers.Authorization = `Bearer ${dashboardToken}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearDashboardSession();
    }
    return Promise.reject(error);
  }
);

// Also set defaults for backward compatibility
axios.defaults.baseURL = API_BASE_URL;

export default api;
export { api };
