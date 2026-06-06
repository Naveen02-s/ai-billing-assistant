import axios from "axios";

const DEFAULT_BACKEND_PORT = "5000";
const CODESPACES_HOST_PATTERN = /^(.+)-\d+\.app\.github\.dev$/i;

const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const defaultApiUrl = () => {
  if (typeof window !== "undefined") {
    const match = window.location.hostname.match(CODESPACES_HOST_PATTERN);
    if (match) {
      return `${window.location.protocol}//${match[1]}-${DEFAULT_BACKEND_PORT}.app.github.dev`;
    }
  }

  return "http://localhost:5000";
};

const normalizeApiBaseUrl = (value) => {
  const rawUrl = trimTrailingSlashes(value || defaultApiUrl());
  return rawUrl.replace(/\/api$/, "");
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smartbill_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
