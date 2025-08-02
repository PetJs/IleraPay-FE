import axios from "axios";
import useUserStore from "@/store/user-store";

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

console.log("❯ SERVER_URL:", SERVER_URL);

export const publicApi = axios.create({
  baseURL: SERVER_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = axios.create({
  baseURL: SERVER_URL,
  timeout: 60000,
});

// ✅ Update interceptor to use 'Bearer'
authApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;
    console.log("❯ Using token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ✅ Changed from 'Token'
    }
    return config;
  },
  (error) => Promise.reject(error)
);
