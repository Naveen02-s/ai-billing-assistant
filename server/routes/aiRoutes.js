import { Router } from "express";
import {
  businessAssistant,
  customerIntelligence,
  productRecommendations,
  revenueAnalysis,
  salesInsights
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/assistant", businessAssistant);
router.get("/sales-insights", salesInsights);
router.get("/product-recommendations", productRecommendations);
router.get("/revenue-analysis", revenueAnalysis);
router.get("/customer-intelligence", customerIntelligence);

export default router;
