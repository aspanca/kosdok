import axios from "axios";
import type { ApiError } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ACCESS_TOKEN_KEY = "kosdok_access_token";
const REFRESH_TOKEN_KEY = "kosdok_refresh_token";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await axios.post<{ success: boolean; data: { accessToken: string; refreshToken: string } }>(
            `${API_URL}/auth/refresh`,
            { refreshToken }
          );
          if (data.success && data.data) {
            setTokens(data.data.accessToken, data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
            return api(originalRequest);
          }
        } catch {
          clearTokens();
          window.location.href = "/signin";
        }
      }
    }

    const message =
      (error.response?.data as ApiError | undefined)?.message || "Diçka shkoi gabim";
    return Promise.reject(new Error(message));
  }
);
