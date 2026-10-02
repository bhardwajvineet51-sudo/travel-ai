import { Router } from "express";
import * as aiController from "../controllers/aiController";
import { validate } from "../middleware/validate";
import { optionalAuth } from "../middleware/auth";
import { tripPlanSchema, optimizeBudgetSchema } from "../validators";

const router = Router();

router.post("/plan-trip", optionalAuth, validate(tripPlanSchema), aiController.planTrip);
router.post("/optimize-budget", optionalAuth, validate(optimizeBudgetSchema), aiController.optimizeBudget);

export default router;
