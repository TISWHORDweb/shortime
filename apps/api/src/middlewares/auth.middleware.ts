import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { verifyAccessToken } from "../modules/auth/auth.utils";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid access token");
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyAccessToken(token);
  req.auth = { userId: payload.sub, role: payload.role };
  next();
};
