import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(protect, allowRoles("Admin", "Manager"));
router.get("/", getAnalytics);

export default router;
