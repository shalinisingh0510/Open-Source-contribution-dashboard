import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

export const unwrapResponse = (response) => response?.data?.data;
