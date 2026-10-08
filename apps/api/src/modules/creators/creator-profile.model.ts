import { Schema, model, Types } from "mongoose";

export interface ICreatorProfile {
  userId: Types.ObjectId;
  bio: string;
  avatarUrl?: string;
  subscriptionPrice: number;
  totalEarnings: number;
  isApproved: boolean;
  hasFreeVideo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const creatorProfileSchema = new Schema<ICreatorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String },
    subscriptionPrice: { type: Number, default: 10, min: 1 },
    totalEarnings: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    hasFreeVideo: { type: Boolean, default: false }
  },
  { timestamps: true }
);

creatorProfileSchema.index({ isApproved: 1 });

export const CreatorProfileModel = model<ICreatorProfile>("CreatorProfile", creatorProfileSchema);
