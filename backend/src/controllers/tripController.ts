import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import * as tripService from "../services/tripService";

export const createTrip = asyncHandler(async (req: Request, res: Response) => {
  const result = await tripService.planTrip(req.user!.userId, req.body);
  res.status(201).json({ success: true, data: result });
});

export const listTrips = asyncHandler(async (req: Request, res: Response) => {
  const trips = await tripService.listUserTrips(req.user!.userId);
  res.json({ success: true, data: trips });
});

export const getTrip = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.getTripById(req.user!.userId, req.params.id);
  res.json({ success: true, data: trip });
});

export const removeTrip = asyncHandler(async (req: Request, res: Response) => {
  const result = await tripService.deleteTrip(req.user!.userId, req.params.id);
  res.json({ success: true, data: result });
});
