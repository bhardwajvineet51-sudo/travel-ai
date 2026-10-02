export interface ApiError {
  success: false;
  message: string;
  errorCode: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface AuthTokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export interface TripPlanRequest {
  destination: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  numberOfAdults: number;
  numberOfChildren: number;
  budget: number;
  currency: string;
  travelPreferences: string[];
  travelStyle: "Budget" | "Moderate" | "Premium" | "Luxury";
  transportPreference: "Flight" | "Train" | "Bus" | "Car" | "No preference";
}

export interface BudgetBreakdown {
  transport: number;
  hotel: number;
  food: number;
  activities: number;
  localTransport: number;
  miscellaneous: number;
  total: number;
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  estimatedCost: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface HotelRecommendation {
  name: string;
  pricePerNight: number;
  rating: number;
  reason: string;
}

export interface AiTripPlan {
  destination: string;
  tripSummary: string;
  estimatedBudget: BudgetBreakdown;
  hotelRecommendations: HotelRecommendation[];
  itinerary: ItineraryDay[];
  restaurants: { name: string; cuisine: string; priceLevel: string }[];
  activities: { name: string; estimatedCost: number; category: string }[];
  transportSuggestions: { mode: string; estimatedCost: number; note: string }[];
  budgetTips: string[];
  warnings: string[];
  isOverBudget: boolean;
  overBudgetAmount: number;
  isMockData: boolean;
}
