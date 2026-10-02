import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import * as hotelService from "../services/hotelService";
import { getWeather } from "../services/adapters/weatherApiAdapter";

export const searchHotels = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as any;
  const result = await hotelService.findHotels({
    destination: q.destination,
    checkIn: q.checkIn,
    checkOut: q.checkOut,
    guests: q.guests,
    rooms: q.rooms,
    minPrice: q.minPrice,
    maxPrice: q.maxPrice,
    minRating: q.minRating,
    amenities: q.amenities ? String(q.amenities).split(",") : undefined,
    page: q.page,
    pageSize: q.pageSize,
  });
  res.json({ success: true, data: result });
});

export const getHotel = asyncHandler(async (req: Request, res: Response) => {
  const details = await hotelService.getHotelDetails(req.params.id);
  res.json({ success: true, data: details });
});

export const getHotelRooms = asyncHandler(async (req: Request, res: Response) => {
  const details = await hotelService.getHotelDetails(req.params.id);
  res.json({ success: true, data: details.rooms });
});

export const getDestinationWeather = asyncHandler(async (req: Request, res: Response) => {
  const weather = await getWeather(req.params.destination);
  res.json({ success: true, data: weather });
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const result = await hotelService.toggleFavorite(req.user!.userId, req.params.hotelId, true);
  res.json({ success: true, data: result });
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const result = await hotelService.toggleFavorite(req.user!.userId, req.params.hotelId, false);
  res.json({ success: true, data: result });
});

export const listFavorites = asyncHandler(async (req: Request, res: Response) => {
  const favorites = await hotelService.listFavorites(req.user!.userId);
  res.json({ success: true, data: favorites });
});
