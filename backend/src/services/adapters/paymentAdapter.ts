import crypto from "crypto";
import { env, hasRealPaymentGateway } from "../../config/env";

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string; // safe to send to frontend (public key), never the secret
  isMockData: boolean;
}

/**
 * Payment adapter shaped around Razorpay's order/verify flow so a real
 * integration is a drop-in swap. Architecture supports adding Stripe
 * later behind the same interface.
 *
 * Frontend NEVER decides payment success — verifyPaymentSignature() is
 * the only source of truth, and it runs here, on the backend, using the
 * secret key which is never sent to the client.
 */
export async function createPaymentOrder(bookingId: string, amount: number, currency: string): Promise<PaymentOrder> {
  if (hasRealPaymentGateway) {
    return createRealRazorpayOrder(bookingId, amount, currency);
  }
  return {
    orderId: `mock_order_${bookingId}`,
    amount,
    currency,
    keyId: "mock_key_id",
    isMockData: true,
  };
}

async function createRealRazorpayOrder(
  _bookingId: string,
  _amount: number,
  _currency: string
): Promise<PaymentOrder> {
  // TODO: use the official `razorpay` npm package with RAZORPAY_KEY_ID /
  // RAZORPAY_KEY_SECRET to create a real order.
  throw new Error("Real Razorpay integration not implemented. Set RAZORPAY_KEY_ID/SECRET.");
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!hasRealPaymentGateway) {
    // Dev/demo mode: accept only the sentinel mock signature so nothing
    // is silently "verified" in an unconfigured environment.
    return signature === `mock_signature_${orderId}_${paymentId}`;
  }
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}
