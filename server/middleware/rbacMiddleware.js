import { ApiError } from "../lib/apiError.js";

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role.name)) {
    throw new ApiError(403, "You do not have permission to perform this action");
  }
  next();
};
