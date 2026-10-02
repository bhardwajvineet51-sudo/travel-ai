import { hasRealHotelApi } from "../../config/env";

export interface HotelSearchParams {
  destination: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  rooms: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  page: number;
  pageSize: number;
}

export interface ExternalHotelResult {
  externalHotelId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  distanceFromCenterKm: number;
  pricePerNight: number;
  currency: string;
  available: boolean; // MUST come from the real API in production
}

/**
 * Hotel availability/pricing adapter.
 *
 * IMPORTANT: When HOTEL_API_KEY is not configured, this returns clearly
 * labeled MOCK data for local development only. Never present mock
 * results to end users as real availability — the frontend must show
 * a "Demo data" badge whenever `isMockData` is true on the response.
 *
 * To go live: implement callRealHotelApi() below against your chosen
 * provider (e.g. Booking.com Demand API, Amadeus, RateHawk) and it will
 * be used automatically once HOTEL_API_KEY is set.
 */
export async function searchHotels(
  params: HotelSearchParams
): Promise<{ results: ExternalHotelResult[]; total: number; isMockData: boolean }> {
  if (hasRealHotelApi) {
    return callRealHotelApi(params);
  }
  return { ...buildMockResults(params), isMockData: true };
}

async function callRealHotelApi(
  _params: HotelSearchParams
): Promise<{ results: ExternalHotelResult[]; total: number; isMockData: boolean }> {
  // TODO: integrate your real hotel provider here. Left unimplemented
  // intentionally so no one accidentally ships fake "real" data.
  throw new Error(
    "Real hotel API integration not implemented. Set HOTEL_API_KEY and implement callRealHotelApi()."
  );
}

function buildMockResults(params: HotelSearchParams) {
  const basePrice =
    params.minPrice && params.maxPrice
      ? (params.minPrice + params.maxPrice) / 2
      : 2500;

  const allAmenities = ["WiFi", "Pool", "Parking", "Breakfast", "Gym", "Spa", "AC", "Restaurant"];

  const results: ExternalHotelResult[] = Array.from({ length: 24 }, (_, i) => {
    const price = Math.round(basePrice * (0.6 + (i % 6) * 0.15));
    return {
      externalHotelId: `mock-${params.destination.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
      name: `${params.destination} ${["Grand", "Palm", "Sunrise", "Royal", "Heritage", "Ocean"][i % 6]} Hotel`,
      location: params.destination,
      latitude: 15.5 + i * 0.01,
      longitude: 73.8 + i * 0.01,
      rating: Math.round((3.2 + (i % 8) * 0.2) * 10) / 10,
      reviewCount: 40 + i * 17,
      image: `https://picsum.photos/seed/hotel${i}/640/420`,
      amenities: allAmenities.filter((_, idx) => (i + idx) % 3 !== 0),
      distanceFromCenterKm: Math.round((1 + (i % 10) * 0.8) * 10) / 10,
      pricePerNight: price,
      currency: "INR",
      available: true,
    };
  })
    .filter((h) => !params.minPrice || h.pricePerNight >= params.minPrice)
    .filter((h) => !params.maxPrice || h.pricePerNight <= params.maxPrice)
    .filter((h) => !params.minRating || h.rating >= params.minRating)
    .filter(
      (h) =>
        !params.amenities?.length ||
        params.amenities.every((a) => h.amenities.includes(a))
    );

  const start = (params.page - 1) * params.pageSize;
  const page = results.slice(start, start + params.pageSize);
  return { results: page, total: results.length };
}
