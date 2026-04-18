import axios from "axios";

const productionApiUrl = "https://north-luxe-backend.vercel.app/api";
const localApiUrl = "http://localhost:5000/api";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? productionApiUrl : localApiUrl);

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const unwrap = (response) => response.data;
