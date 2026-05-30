import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/apiError.js";
import { verifyCashfreeWebhookSignature } from "../services/cashfreeService.js";
import { handleVerifiedCashfreeWebhook } from "../services/paymentService.js";

export const cashfreeWebhook = asyncHandler(async (req, res) => {
  const valid = verifyCashfreeWebhookSignature({
    signature: req.headers["x-webhook-signature"],
    timestamp: req.headers["x-webhook-timestamp"],
    rawBody: req.rawBody
  });

  if (!valid) throw new ApiError(401, "Invalid Cashfree webhook signature");

  const payload = JSON.parse(req.rawBody);
  const result = await handleVerifiedCashfreeWebhook(payload);

  res.status(200).json({ received: true, result });
});
