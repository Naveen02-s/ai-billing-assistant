import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { ApiError } from "../lib/apiError.js";

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;

    if (!token) throw new ApiError(401, "Authentication required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    });

    if (!user) throw new ApiError(401, "Session is no longer valid");
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid or expired token"));
  }
};
