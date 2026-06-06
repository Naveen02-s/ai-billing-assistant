import { io } from "socket.io-client";

const DEFAULT_BACKEND_PORT = "5000";
const CODESPACES_HOST_PATTERN = /^(.+)-\d+\.app\.github\.dev$/i;

const trimTrailingSlashes = (value) => value.replace(/\/+$/, "");

const defaultSocketUrl = () => {
  const match = window.location.hostname.match(CODESPACES_HOST_PATTERN);
  if (match) {
    return `${window.location.protocol}//${match[1]}-${DEFAULT_BACKEND_PORT}.app.github.dev`;
  }

  return "http://localhost:5000";
};

const normalizeSocketUrl = () => {
  const explicitUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

  return trimTrailingSlashes(explicitUrl || defaultSocketUrl()).replace(/\/api$/, "");
};

export const socket = io(normalizeSocketUrl(), {
  autoConnect: false,
  transports: ["websocket"]
});
