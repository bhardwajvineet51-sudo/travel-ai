import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8).max(128),
});

export const tripPlanSchema = z.object({
  destination: z.string().min(2).max(100),
  startDate: z.string().refine((d) => !Number.isNaN(Date.parse(d)), "Invalid startDate"),
  endDate: z.string().refine((d) => !Number.isNaN(Date.parse(d)), "Invalid endDate"),
  numberOfAdults: z.number().int().min(1).max(20),
  numberOfChildren: z.number().int().min(0).max(20).default(0),
  budget: z.number().positive(),
  currency: z.string().min(3).max(3).default("INR"),
  travelPreferences: z.array(
    z.enum([
      "Adventure", "Beach", "Nature", "Luxury", "Budget", "Family",
      "Couple", "Solo", "Nightlife", "Food", "Shopping", "Historical", "Spiritual",
    ])
  ).min(1),
  travelStyle: z.enum(["Budget", "Moderate", "Premium", "Luxury"]),
  transportPreference: z.enum(["Flight", "Train", "Bus", "Car", "No preference"]),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "endDate must be after startDate",
  path: ["endDate"],
});

export const optimizeBudgetSchema = tripPlanSchema.innerType().extend({
  newBudget: z.number().positive(),
});

export const hotelSearchSchema = z.object({
  destination: z.string().min(2),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.coerce.number().int().min(1).default(2),
  rooms: z.coerce.number().int().min(1).default(1),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  amenities: z.string().optional(), // comma-separated
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export const createBookingSchema = z.object({
  hotelId: z.string(),
  roomId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1),
  guestFirstName: z.string().min(1),
  guestLastName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(5),
  guestNationality: z.string().optional(),
  specialRequests: z.string().optional(),
});

export const createPaymentOrderSchema = z.object({
  bookingId: z.string(),
});

export const verifyPaymentSchema = z.object({
  bookingId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});
