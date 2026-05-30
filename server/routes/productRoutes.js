import { Router } from "express";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/rbacMiddleware.js";
import { validate } from "../middleware/validate.js";
import { productSchema } from "../validators/businessValidators.js";

const router = Router();

router.use(protect);
router.get("/", listProducts);
router.post("/", allowRoles("Admin", "Manager"), validate(productSchema), createProduct);
router.put("/:id", allowRoles("Admin", "Manager"), validate(productSchema), updateProduct);
router.delete("/:id", allowRoles("Admin"), deleteProduct);

export default router;
