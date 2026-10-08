"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveCreator = exports.getCreatorProfile = exports.upsertCreatorProfile = void 0;
const zod_1 = require("zod");
const api_error_1 = require("../../lib/api-error");
const async_handler_1 = require("../../lib/async-handler");
const user_model_1 = require("../users/user.model");
const creator_profile_model_1 = require("./creator-profile.model");
const creatorProfileSchema = zod_1.z.object({
    bio: zod_1.z.string().max(1000).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    subscriptionPrice: zod_1.z.number().min(1).max(500).optional()
});
exports.upsertCreatorProfile = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.auth) {
        throw new api_error_1.ApiError(401, "Unauthorized");
    }
    const payload = creatorProfileSchema.parse(req.body);
    const user = await user_model_1.UserModel.findById(req.auth.userId);
    if (!user) {
        throw new api_error_1.ApiError(404, "User not found");
    }
    if (user.role !== "creator") {
        throw new api_error_1.ApiError(403, "Only creators can manage creator profile");
    }
    const profile = await creator_profile_model_1.CreatorProfileModel.findOneAndUpdate({ userId: req.auth.userId }, { $set: payload, $setOnInsert: { userId: req.auth.userId } }, { upsert: true, new: true });
    res.json(profile);
});
exports.getCreatorProfile = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const profile = await creator_profile_model_1.CreatorProfileModel.findOne({ userId: req.params.creatorId });
    if (!profile) {
        throw new api_error_1.ApiError(404, "Creator profile not found");
    }
    res.json(profile);
});
exports.approveCreator = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const profile = await creator_profile_model_1.CreatorProfileModel.findOneAndUpdate({ userId: req.params.creatorId }, { isApproved: true }, { new: true });
    if (!profile) {
        throw new api_error_1.ApiError(404, "Creator profile not found");
    }
    res.json(profile);
});
