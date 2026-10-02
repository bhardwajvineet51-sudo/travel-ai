import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import * as tripService from "../services/tripService";

export const planTrip = asyncHandler(async (req: Request, res: Response) => {
  const result = await tripService.planTrip(req.user?.userId, req.body);
  res.json({ success: true, data: result });
});

export const optimizeBudget = asyncHandler(async (req: Request, res: Response) => {
  const { newBudget, ...tripRequest } = req.body;
  const plan = await tripService.reoptimizeBudget(tripRequest, newBudget);
  res.json({ success: true, data: { plan } });
});
