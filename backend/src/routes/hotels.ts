import { Router } from "express";
import * as hotelController from "../controllers/hotelController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { hotelSearchSchema } from "../validators";

const router = Router();

router.get("/search", validate(hotelSearchSchema, "query"), hotelController.searchHotels);
router.get("/:id", hotelController.getHotel);
router.get("/:id/rooms", hotelController.getHotelRooms);
router.get("/weather/:destination", hotelController.getDestinationWeather);
router.post("/favorites/:hotelId", requireAuth, hotelController.addFavorite);
router.delete("/favorites/:hotelId", requireAuth, hotelController.removeFavorite);
router.get("/favorites/mine", requireAuth, hotelController.listFavorites);

export default router;
