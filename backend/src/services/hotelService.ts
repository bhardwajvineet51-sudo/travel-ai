import { prisma } from "../config/prisma";
import { searchHotels, HotelSearchParams } from "./adapters/hotelApiAdapter";
import { AppError } from "../middleware/errorHandler";

export async function findHotels(params: HotelSearchParams) {
  const { results, total, isMockData } = await searchHotels(params);
  return {
    hotels: results,
    total,
    page: params.page,
    pageSize: params.pageSize,
    isMockData,
  };
}

// Rooms are derived deterministically from the mock hotel's base price
// so the details/booking flow has consistent data to work against.
// Once a real hotel API is wired up, replace this with a real room list.
export async function getHotelDetails(externalHotelId: string) {
  const basePrice = 2000 + (hashString(externalHotelId) % 3000);
  return {
    externalHotelId,
    name: `Hotel ${externalHotelId}`,
    description: "A comfortable stay with modern amenities, centrally located near major attractions.",
    rating: 4.2,
    reviewCount: 312,
    location: "City Center",
    image: `https://picsum.photos/seed/${externalHotelId}/800/500`,
    gallery: [0, 1, 2, 3].map((i) => `https://picsum.photos/seed/${externalHotelId}-${i}/800/500`),
    amenities: ["WiFi", "Pool", "Breakfast", "AC"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in.",
    rooms: [
      { id: `${externalHotelId}-standard`, name: "Standard Room", price: basePrice, capacity: 2, amenities: ["WiFi", "AC"], description: "Cozy room with all essentials." },
      { id: `${externalHotelId}-deluxe`, name: "Deluxe Room", price: Math.round(basePrice * 1.4), capacity: 3, amenities: ["WiFi", "AC", "Breakfast"], description: "Spacious room with city view." },
      { id: `${externalHotelId}-suite`, name: "Suite", price: Math.round(basePrice * 2.1), capacity: 4, amenities: ["WiFi", "AC", "Breakfast", "Spa"], description: "Premium suite with lounge access." },
    ],
    isMockData: true,
  };
}

export async function ensureHotelPersisted(externalHotelId: string, name: string, location: string) {
  const existing = await prisma.hotel.findUnique({ where: { externalHotelId } });
  if (existing) return existing;
  return prisma.hotel.create({
    data: { externalHotelId, name, location, amenities: [] },
  });
}

export async function toggleFavorite(userId: string, hotelId: string, add: boolean) {
  if (add) {
    await prisma.favorite.upsert({
      where: { userId_hotelId: { userId, hotelId } },
      create: { userId, hotelId },
      update: {},
    });
    return { favorited: true };
  }
  await prisma.favorite.deleteMany({ where: { userId, hotelId } });
  return { favorited: false };
}

export async function listFavorites(userId: string) {
  return prisma.favorite.findMany({ where: { userId }, include: { hotel: true } });
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
