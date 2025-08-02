import axios from "axios";
import useUserStore from "@/store/user-store";

// Automatically read from Vite's env variable (defined in .env file)
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

console.log("❯ SERVER_URL:", SERVER_URL);

export const publicApi = axios.create({
  baseURL: SERVER_URL,   // Should resolve to "https://nasure.onrender.com/"
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = axios.create({
  baseURL: SERVER_URL,
  timeout: 60000,
});

// Add Authorization token dynamically for authenticated endpoints
authApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Token ${token}`;  // Use 'Bearer' if backend expects that
    }
    return config;
  },
  (error) => Promise.reject(error)
);
