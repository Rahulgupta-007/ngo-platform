import axios from "axios";

const api = axios.create({
  // If we have a hidden env variable, use it. Otherwise, localhost.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Add token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;