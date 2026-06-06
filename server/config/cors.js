const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
const CODESPACES_HOST_PATTERN = /(^|\.)app\.github\.dev$/i;

const parseOrigins = (value = "") => (
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const configuredOrigins = new Set([
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.CORS_ORIGINS)
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.has(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    const normalizedHostname = hostname.toLowerCase();

    if ((protocol === "http:" || protocol === "https:") && LOCALHOST_HOSTS.has(normalizedHostname)) {
      return true;
    }

    return protocol === "https:" && CODESPACES_HOST_PATTERN.test(normalizedHostname);
  } catch {
    return false;
  }
};

export const corsOptions = {
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "x-requested-with", "x-cashfree-signature", "x-cashfree-timestamp"],
  preflightContinue: true,
  optionsSuccessStatus: 204
};

export const socketCorsOptions = {
  origin(origin, callback) {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
};
