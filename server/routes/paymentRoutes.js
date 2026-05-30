import { Router } from "express";
import { getPayments } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getPayments);

export default router;
