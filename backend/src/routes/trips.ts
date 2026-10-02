import { Router } from "express";
import * as tripController from "../controllers/tripController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { tripPlanSchema } from "../validators";

const router = Router();

router.post("/", requireAuth, validate(tripPlanSchema), tripController.createTrip);
router.get("/", requireAuth, tripController.listTrips);
router.get("/:id", requireAuth, tripController.getTrip);
router.delete("/:id", requireAuth, tripController.removeTrip);

export default router;
