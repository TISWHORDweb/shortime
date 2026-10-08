"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatorProfileModel = void 0;
const mongoose_1 = require("mongoose");
const creatorProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String },
    subscriptionPrice: { type: Number, default: 10, min: 1 },
    totalEarnings: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    hasFreeVideo: { type: Boolean, default: false }
}, { timestamps: true });
creatorProfileSchema.index({ isApproved: 1 });
exports.CreatorProfileModel = (0, mongoose_1.model)("CreatorProfile", creatorProfileSchema);
