import { Router } from "express";
import { cashfreeWebhook } from "../webhooks/cashfreeWebhook.js";

const router = Router();

router.post("/cashfree", cashfreeWebhook);

export default router;
