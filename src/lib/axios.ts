// src/lib/axios.ts
import axios from "axios";
import { SERVER_URL } from "@/lib/constant";
import useUserStore from "@/store/user-store";

const API_KEY = import.meta.env.VITE_REQRES_API_KEY; 

console.log("❯ SERVER_URL:", SERVER_URL);
console.log("❯ API_KEY:", API_KEY);

export const publicApi = axios.create({
  baseURL: SERVER_URL,   // e.g. "https://api.reqres.in/v2"
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
  },
});

export const authApi = axios.create({
  baseURL: SERVER_URL,
  timeout: 60000,
});

authApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
