import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";
import { getHotelDetails, ensureHotelPersisted } from "./hotelService";

interface CreateBookingInput {
  userId: string;
  hotelId: string; // externalHotelId
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  guestNationality?: string;
  specialRequests?: string;
}

export async function createBooking(input: CreateBookingInput) {
  const details = await getHotelDetails(input.hotelId);
  const room = details.rooms.find((r) => r.id === input.roomId);
  if (!room) throw new AppError("Selected room is unavailable.", 400, "ROOM_NOT_FOUND");

  const nights = Math.max(
    1,
    Math.ceil((new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) / 86_400_000)
  );
  const totalAmount = room.price * nights;

  const hotel = await ensureHotelPersisted(input.hotelId, details.name, details.location);

  // Room isn't persisted from the mock adapter by default — create it
  // lazily so the Booking foreign key is valid.
  let dbRoom = await prisma.room.findFirst({ where: { hotelId: hotel.id, name: room.name } });
  if (!dbRoom) {
    dbRoom = await prisma.room.create({
      data: {
        hotelId: hotel.id,
        name: room.name,
        description: room.description,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities,
      },
    });
  }

  const booking = await prisma.booking.create({
    data: {
      userId: input.userId,
      hotelId: hotel.id,
      roomId: dbRoom.id,
      checkIn: new Date(input.checkIn),
      checkOut: new Date(input.checkOut),
      guests: input.guests,
      totalAmount,
      status: "PENDING",
      guestFirstName: input.guestFirstName,
      guestLastName: input.guestLastName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      guestNationality: input.guestNationality,
      specialRequests: input.specialRequests,
    },
    include: { hotel: true, room: true },
  });

  return booking;
}

export async function getBooking(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { hotel: true, room: true, payment: true },
  });
  if (!booking) throw new AppError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  return booking;
}

export async function listBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { hotel: true, room: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function cancelBooking(userId: string, bookingId: string) {
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, userId } });
  if (!booking) throw new AppError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  if (booking.status === "CANCELLED") {
    throw new AppError("Booking is already cancelled.", 400, "ALREADY_CANCELLED");
  }
  return prisma.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED" } });
}

export async function markBookingConfirmed(bookingId: string) {
  return prisma.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });
}
