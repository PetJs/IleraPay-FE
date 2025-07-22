import axios from "axios";
import { SERVER_URL } from "@/lib/constant";
import useUserStore from "@/store/user-store";

export const publicApi = axios.create({
  baseURL: SERVER_URL,
  timeout: 60000,
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
