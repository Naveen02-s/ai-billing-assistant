import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { ApiError } from "../lib/apiError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { sanitizeUser, signToken } from "../services/tokenService.js";

export const register = asyncHandler(async (req, res) => {
  const exists = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (exists) throw new ApiError(409, "Email is already registered");

  const role = await prisma.role.findUnique({ where: { name: req.body.role } });
  if (!role) throw new ApiError(400, "Selected role does not exist. Run the seed first.");

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 12),
      roleId: role.id
    },
    include: { role: true }
  });

  res.status(201).json({ user: sanitizeUser(user), token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    include: { role: true }
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({ user: sanitizeUser(user), token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
