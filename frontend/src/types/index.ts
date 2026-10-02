export type TravelPreference =
  | "Adventure" | "Beach" | "Nature" | "Luxury" | "Budget" | "Family"
  | "Couple" | "Solo" | "Nightlife" | "Food" | "Shopping" | "Historical" | "Spiritual";

export type TravelStyle = "Budget" | "Moderate" | "Premium" | "Luxury";
export type TransportPreference = "Flight" | "Train" | "Bus" | "Car" | "No preference";

export interface TripPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  budget: number;
  currency: string;
  travelPreferences: TravelPreference[];
  travelStyle: TravelStyle;
  transportPreference: TransportPreference;
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

export interface Hotel {
  externalHotelId: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  distanceFromCenterKm: number;
  pricePerNight: number;
  currency: string;
  available: boolean;
}
