import { apiClient } from "./apiClient";
import type { AiTripPlan, TripPlanRequest } from "../types";

export async function planTrip(req: TripPlanRequest): Promise<{ tripId?: string; plan: AiTripPlan }> {
  const { data } = await apiClient.post("/ai/plan-trip", req);
  return data.data;
}

export async function optimizeBudget(req: TripPlanRequest, newBudget: number): Promise<{ plan: AiTripPlan }> {
  const { data } = await apiClient.post("/ai/optimize-budget", { ...req, newBudget });
  return data.data;
}
