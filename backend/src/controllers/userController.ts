import { Request, Response } from "express";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { prisma } from "../config/prisma";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, phone: true, profileImage: true, createdAt: true },
  });
  if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  res.json({ success: true, data: user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, profileImage } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { name, phone, profileImage },
    select: { id: true, name: true, email: true, phone: true, profileImage: true },
  });
  res.json({ success: true, data: user });
});
