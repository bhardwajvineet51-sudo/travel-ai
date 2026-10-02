import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import * as authService from "../services/authService";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  const result = await authService.registerUser(name, email, password, phone);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json({ success: true, data: result });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Stateless JWT — logout is handled client-side by discarding the token.
  res.json({ success: true, data: { message: "Logged out." } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.requestPasswordReset(req.body.email);
  res.json({ success: true, data: result });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  const result = await authService.resetPassword(token, newPassword);
  res.json({ success: true, data: result });
});
