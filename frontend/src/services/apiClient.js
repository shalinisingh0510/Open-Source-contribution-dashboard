import axios from "axios";

const normalizedBaseUrl = `${import.meta.env.VITE_API_BASE_URL || ""}`.trim();
const API_BASE_URL =
  normalizedBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : "");

export const createApiConfigError = () => {
  const error = new Error(
    "Backend API is not configured. Set VITE_API_BASE_URL in your deployment."
  );
  error.code = "API_BASE_URL_NOT_CONFIGURED";
  return error;
};

export const isApiConfigured = () => Boolean(API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  if (!isApiConfigured()) {
    return Promise.reject(createApiConfigError());
  }

  return config;
});

export const unwrapResponse = (response) => response?.data?.data;
