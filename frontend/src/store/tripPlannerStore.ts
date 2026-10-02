import { create } from "zustand";
import type { TripPlanRequest } from "../types";

interface TripPlannerState {
  step: number;
  data: Partial<TripPlanRequest>;
  setStep: (step: number) => void;
  update: (patch: Partial<TripPlanRequest>) => void;
  reset: () => void;
}

const initialData: Partial<TripPlanRequest> = {
  numberOfAdults: 2,
  numberOfChildren: 0,
  currency: "INR",
  travelPreferences: [],
  travelStyle: "Moderate",
  transportPreference: "No preference",
};

export const useTripPlannerStore = create<TripPlannerState>((set) => ({
  step: 1,
  data: initialData,
  setStep: (step) => set({ step }),
  update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  reset: () => set({ step: 1, data: initialData }),
}));
