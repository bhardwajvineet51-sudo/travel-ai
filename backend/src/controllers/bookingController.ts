import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import * as bookingService from "../services/bookingService";

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking({ userId: req.user!.userId, ...req.body });
  res.status(201).json({ success: true, data: booking });
});

export const listBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.listBookings(req.user!.userId);
  res.json({ success: true, data: bookings });
});

export const getBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.getBooking(req.user!.userId, req.params.id);
  res.json({ success: true, data: booking });
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(req.user!.userId, req.params.id);
  res.json({ success: true, data: booking });
});
