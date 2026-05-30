import { asyncHandler } from "../lib/asyncHandler.js";
import { listPayments } from "../services/paymentService.js";

export const getPayments = asyncHandler(async (_req, res) => {
  res.json(await listPayments());
});
