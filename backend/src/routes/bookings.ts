import { Router } from "express";
import * as bookingController from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createBookingSchema } from "../validators";

const router = Router();

router.post("/", requireAuth, validate(createBookingSchema), bookingController.createBooking);
router.get("/", requireAuth, bookingController.listBookings);
router.get("/:id", requireAuth, bookingController.getBooking);
router.post("/:id/cancel", requireAuth, bookingController.cancelBooking);

export default router;
