import { Router } from "express";
import { createInvoice, exportInvoicePdf, getInvoice, getInvoices } from "../controllers/invoiceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { invoiceSchema } from "../validators/businessValidators.js";

const router = Router();

router.use(protect);
router.get("/", getInvoices);
router.get("/:id/pdf", exportInvoicePdf);
router.get("/:id", getInvoice);
router.post("/", validate(invoiceSchema), createInvoice);

export default router;
