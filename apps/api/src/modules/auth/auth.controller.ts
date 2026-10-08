import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { env } from "../../config/env";
import { ApiError } from "../../lib/api-error";
import { asyncHandler } from "../../lib/async-handler";
import { UserModel, UserRole } from "../users/user.model";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "./auth.utils";
import { RefreshTokenModel } from "./refresh-token.model";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["fan", "creator"]).default("fan")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const setRefreshCookie = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  });
};

const buildAuthResponse = (userId: string, role: UserRole) => ({
  accessToken: signAccessToken(userId, role),
  role
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await UserModel.create({
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role
  });

  const refreshToken = signRefreshToken(user._id.toString(), user.role);
  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
  });

  setRefreshCookie(res, refreshToken);
  res.status(201).json(buildAuthResponse(user._id.toString(), user.role));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const user = await UserModel.findOne({ email: payload.email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const refreshToken = signRefreshToken(user._id.toString(), user.role);
  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
  });

  setRefreshCookie(res, refreshToken);
  res.json(buildAuthResponse(user._id.toString(), user.role));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) {
    throw new ApiError(401, "Missing refresh token");
  }

  const payload = verifyRefreshToken(token);
  const tokenHash = hashToken(token);
  const storedToken = await RefreshTokenModel.findOne({
    userId: payload.sub,
    tokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  });

  if (!storedToken) {
    throw new ApiError(401, "Refresh token invalid or expired");
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();

  const nextRefreshToken = signRefreshToken(payload.sub, payload.role);
  await RefreshTokenModel.create({
    userId: payload.sub,
    tokenHash: hashToken(nextRefreshToken),
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
  });

  setRefreshCookie(res, nextRefreshToken);
  res.json(buildAuthResponse(payload.sub, payload.role));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (token) {
    await RefreshTokenModel.updateOne({ tokenHash: hashToken(token) }, { revokedAt: new Date() });
  }
  res.clearCookie("refreshToken");
  res.status(204).send();
});

export const confirmAdult = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await UserModel.findByIdAndUpdate(req.auth.userId, { isAdultVerified: true }, { new: true }).select(
    "-passwordHash"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json(user);
});
