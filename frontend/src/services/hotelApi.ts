import { apiClient } from "./apiClient";
import type { Hotel } from "../types";

export interface HotelSearchFilters {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  page?: number;
}

export async function searchHotels(filters: HotelSearchFilters) {
  const { data } = await apiClient.get("/hotels/search", {
    params: { ...filters, amenities: filters.amenities?.join(",") },
  });
  return data.data as { hotels: Hotel[]; total: number; page: number; pageSize: number; isMockData: boolean };
}
