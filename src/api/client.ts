import axios from "axios";
import { API_BASE_URL, DEFAULT_HEADERS } from "./constants";
import { authCookies } from "./cookies";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ...DEFAULT_HEADERS,
  },
});

apiClient.interceptors.request.use((config) => {
  const token = authCookies.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
