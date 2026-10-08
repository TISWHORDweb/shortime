import { Schema, model } from "mongoose";

export type UserRole = "fan" | "creator" | "admin";

export interface IUser {
  email: string;
  passwordHash: string;
  role: UserRole;
  isAdultVerified: boolean;
  isBanned: boolean;
  walletBalancePending: number;
  walletBalanceAvailable: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["fan", "creator", "admin"], default: "fan", required: true },
    isAdultVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    walletBalancePending: { type: Number, default: 0 },
    walletBalanceAvailable: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.index({ role: 1, isBanned: 1 });

export const UserModel = model<IUser>("User", userSchema);
