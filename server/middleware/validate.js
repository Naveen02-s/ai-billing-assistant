import { ApiError } from "../lib/apiError.js";

export const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    throw new ApiError(422, "Validation failed", error.details.map((item) => item.message));
  }

  req.body = value;
  next();
};
