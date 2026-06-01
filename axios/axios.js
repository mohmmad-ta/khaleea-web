import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.khaleeaapp.com/api/v1";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Also set defaults for backward compatibility
axios.defaults.baseURL = API_BASE_URL;

export default api;
export { api };
