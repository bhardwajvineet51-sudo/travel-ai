import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler";

const SALT_ROUNDS = 12;

export async function registerUser(name: string, email: string, password: string, phone?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("An account with this email already exists.", 409, "EMAIL_IN_USE");
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, phone },
  });

  return issueSession(user.id, user.role);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");

  return issueSession(user.id, user.role);
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond successfully even if the user doesn't exist, to avoid
  // leaking which emails are registered.
  if (!user) return { message: "If that email exists, a reset link has been sent." };

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  // TODO: send via the Email API adapter (see services/emailService.ts).
  return { message: "If that email exists, a reset link has been sent.", devToken: env.nodeEnv !== "production" ? token : undefined };
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });
  if (!user) throw new AppError("Reset link is invalid or has expired.", 400, "RESET_TOKEN_INVALID");

  const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetTokenExpiry: null },
  });

  return { message: "Password has been reset successfully." };
}

function issueSession(userId: string, role: string) {
  const token = jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
  return { token };
}
