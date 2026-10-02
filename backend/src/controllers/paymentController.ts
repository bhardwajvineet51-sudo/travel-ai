import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import * as paymentService from "../services/paymentService";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await paymentService.initiatePayment(req.user!.userId, req.body.bookingId);
  res.json({ success: true, data: order });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const booking = await paymentService.confirmPayment(
    req.user!.userId,
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  res.json({ success: true, data: booking });
});
