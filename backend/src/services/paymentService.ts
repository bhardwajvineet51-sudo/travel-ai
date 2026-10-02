import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";
import { createPaymentOrder, verifyPaymentSignature } from "./adapters/paymentAdapter";
import { markBookingConfirmed } from "./bookingService";

export async function initiatePayment(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
  if (!booking) throw new AppError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  if (booking.status !== "PENDING") {
    throw new AppError("This booking is not awaiting payment.", 400, "INVALID_BOOKING_STATE");
  }

  const order = await createPaymentOrder(booking.id, booking.totalAmount, booking.currency);

  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    create: {
      bookingId: booking.id,
      userId,
      amount: booking.totalAmount,
      currency: booking.currency,
      transactionId: order.orderId,
      status: "PENDING",
    },
    update: { transactionId: order.orderId, status: "PENDING" },
  });

  return order;
}

// Verification NEVER trusts the frontend. It recomputes the signature
// server-side against the secret key (or the dev sentinel in mock mode)
// before marking anything as paid.
export async function confirmPayment(
  userId: string,
  bookingId: string,
  orderId: string,
  paymentId: string,
  signature: string
) {
  const valid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!valid) {
    await prisma.payment.updateMany({
      where: { bookingId, userId },
      data: { status: "FAILED" },
    });
    throw new AppError("Payment verification failed.", 400, "PAYMENT_VERIFICATION_FAILED");
  }

  await prisma.payment.updateMany({
    where: { bookingId, userId },
    data: { status: "PAID", transactionId: paymentId },
  });

  const booking = await markBookingConfirmed(bookingId);

  // TODO: send confirmation email via services/emailService.ts

  return booking;
}
