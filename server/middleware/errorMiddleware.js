import { ApiError } from "../lib/apiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || undefined,
    stack: isProduction ? undefined : err.stack
  });
};
