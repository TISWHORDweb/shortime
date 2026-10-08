import { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../../lib/api-error";
import { asyncHandler } from "../../lib/async-handler";
import { UserModel } from "../users/user.model";
import { CreatorProfileModel } from "./creator-profile.model";

const creatorProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  subscriptionPrice: z.number().min(1).max(500).optional()
});

export const upsertCreatorProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = creatorProfileSchema.parse(req.body);

  const user = await UserModel.findById(req.auth.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "creator") {
    throw new ApiError(403, "Only creators can manage creator profile");
  }

  const profile = await CreatorProfileModel.findOneAndUpdate(
    { userId: req.auth.userId },
    { $set: payload, $setOnInsert: { userId: req.auth.userId } },
    { upsert: true, new: true }
  );

  res.json(profile);
});

export const getCreatorProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await CreatorProfileModel.findOne({ userId: req.params.creatorId });
  if (!profile) {
    throw new ApiError(404, "Creator profile not found");
  }
  res.json(profile);
});

export const approveCreator = asyncHandler(async (req: Request, res: Response) => {
  const profile = await CreatorProfileModel.findOneAndUpdate(
    { userId: req.params.creatorId },
    { isApproved: true },
    { new: true }
  );
  if (!profile) {
    throw new ApiError(404, "Creator profile not found");
  }
  res.json(profile);
});
