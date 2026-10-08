"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["fan", "creator", "admin"], default: "fan", required: true },
    isAdultVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    walletBalancePending: { type: Number, default: 0 },
    walletBalanceAvailable: { type: Number, default: 0 }
}, { timestamps: true });
userSchema.index({ role: 1, isBanned: 1 });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
