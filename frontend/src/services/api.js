import axios from "axios";

const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  "https://taskflow-fullstack-2.onrender.com/api";

// Ensure baseURL always ends with /api
const baseURL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
