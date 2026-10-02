import { prisma } from "../config/prisma";
import { generateTripPlan, optimizeBudget } from "../agents/travelAgent";
import { TripPlanRequest } from "../types";
import { AppError } from "../middleware/errorHandler";

export async function planTrip(userId: string | undefined, req: TripPlanRequest) {
  const plan = await generateTripPlan(req);

  // Save the trip only for logged-in users; anonymous users can still
  // preview a plan without an account.
  let tripId: string | undefined;
  if (userId) {
    const saved = await prisma.trip.create({
      data: {
        userId,
        destination: req.destination,
        startDate: new Date(req.startDate),
        endDate: new Date(req.endDate),
        adults: req.numberOfAdults,
        children: req.numberOfChildren,
        budget: req.budget,
        currency: req.currency,
        travelStyle: req.travelStyle,
        preferences: req.travelPreferences,
        transportPreference: req.transportPreference,
        aiPlan: plan as any,
      },
    });
    tripId = saved.id;
  }

  return { tripId, plan };
}

export async function reoptimizeBudget(req: TripPlanRequest, newBudget: number) {
  return optimizeBudget(req, newBudget);
}

export async function listUserTrips(userId: string) {
  return prisma.trip.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getTripById(userId: string, tripId: string) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip) throw new AppError("Trip not found.", 404, "TRIP_NOT_FOUND");
  return trip;
}

export async function deleteTrip(userId: string, tripId: string) {
  const trip = await prisma.trip.findFirst({ where: { id: tripId, userId } });
  if (!trip) throw new AppError("Trip not found.", 404, "TRIP_NOT_FOUND");
  await prisma.trip.delete({ where: { id: tripId } });
  return { message: "Trip deleted." };
}
