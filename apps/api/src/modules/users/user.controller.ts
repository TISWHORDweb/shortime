import { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../../lib/api-error";
import { asyncHandler } from "../../lib/async-handler";
import { UserModel } from "./user.model";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await UserModel.findById(req.auth.userId).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(user);
});

const updateMeSchema = z.object({
  isAdultVerified: z.boolean().optional()
});

export const patchMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new ApiError(401, "Unauthorized");
  }
  const payload = updateMeSchema.parse(req.body);

  const user = await UserModel.findByIdAndUpdate(req.auth.userId, payload, { new: true }).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json(user);
});
