import { Router } from "express";
import { createCustomer, getCustomer, listCustomers, updateCustomer } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/rbacMiddleware.js";
import { validate } from "../middleware/validate.js";
import { customerSchema } from "../validators/businessValidators.js";

const router = Router();

router.use(protect);
router.get("/", listCustomers);
router.get("/:id", getCustomer);
router.post("/", allowRoles("Admin", "Manager", "Cashier"), validate(customerSchema), createCustomer);
router.put("/:id", allowRoles("Admin", "Manager"), validate(customerSchema), updateCustomer);

export default router;
