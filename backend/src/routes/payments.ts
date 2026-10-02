import { Router } from "express";
import * as paymentController from "../controllers/paymentController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createPaymentOrderSchema, verifyPaymentSchema } from "../validators";

const router = Router();

router.post("/create-order", requireAuth, validate(createPaymentOrderSchema), paymentController.createOrder);
router.post("/verify", requireAuth, validate(verifyPaymentSchema), paymentController.verifyPayment);

export default router;
