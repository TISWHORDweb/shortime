import { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { UserRole } from "../modules/users/user.model";

export const requireRole = (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.auth) {
    throw new ApiError(401, "Unauthorized");
  }
  if (!roles.includes(req.auth.role)) {
    throw new ApiError(403, "Insufficient permissions");
  }
  next();
};
