"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAdult = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const api_error_1 = require("../../lib/api-error");
const async_handler_1 = require("../../lib/async-handler");
const user_model_1 = require("../users/user.model");
const auth_utils_1 = require("./auth.utils");
const refresh_token_model_1 = require("./refresh-token.model");
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(["fan", "creator"]).default("fan")
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
const setRefreshCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: env_1.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
    });
};
const buildAuthResponse = (userId, role) => ({
    accessToken: (0, auth_utils_1.signAccessToken)(userId, role),
    role
});
exports.register = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const payload = registerSchema.parse(req.body);
    const existing = await user_model_1.UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
        throw new api_error_1.ApiError(409, "Email already in use");
    }
    const passwordHash = await bcryptjs_1.default.hash(payload.password, 12);
    const user = await user_model_1.UserModel.create({
        email: payload.email.toLowerCase(),
        passwordHash,
        role: payload.role
    });
    const refreshToken = (0, auth_utils_1.signRefreshToken)(user._id.toString(), user.role);
    await refresh_token_model_1.RefreshTokenModel.create({
        userId: user._id,
        tokenHash: (0, auth_utils_1.hashToken)(refreshToken),
        expiresAt: new Date(Date.now() + env_1.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
    });
    setRefreshCookie(res, refreshToken);
    res.status(201).json(buildAuthResponse(user._id.toString(), user.role));
});
exports.login = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const user = await user_model_1.UserModel.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
        throw new api_error_1.ApiError(401, "Invalid credentials");
    }
    const isValid = await bcryptjs_1.default.compare(payload.password, user.passwordHash);
    if (!isValid) {
        throw new api_error_1.ApiError(401, "Invalid credentials");
    }
    const refreshToken = (0, auth_utils_1.signRefreshToken)(user._id.toString(), user.role);
    await refresh_token_model_1.RefreshTokenModel.create({
        userId: user._id,
        tokenHash: (0, auth_utils_1.hashToken)(refreshToken),
        expiresAt: new Date(Date.now() + env_1.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
    });
    setRefreshCookie(res, refreshToken);
    res.json(buildAuthResponse(user._id.toString(), user.role));
});
exports.refresh = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new api_error_1.ApiError(401, "Missing refresh token");
    }
    const payload = (0, auth_utils_1.verifyRefreshToken)(token);
    const tokenHash = (0, auth_utils_1.hashToken)(token);
    const storedToken = await refresh_token_model_1.RefreshTokenModel.findOne({
        userId: payload.sub,
        tokenHash,
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() }
    });
    if (!storedToken) {
        throw new api_error_1.ApiError(401, "Refresh token invalid or expired");
    }
    storedToken.revokedAt = new Date();
    await storedToken.save();
    const nextRefreshToken = (0, auth_utils_1.signRefreshToken)(payload.sub, payload.role);
    await refresh_token_model_1.RefreshTokenModel.create({
        userId: payload.sub,
        tokenHash: (0, auth_utils_1.hashToken)(nextRefreshToken),
        expiresAt: new Date(Date.now() + env_1.env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000)
    });
    setRefreshCookie(res, nextRefreshToken);
    res.json(buildAuthResponse(payload.sub, payload.role));
});
exports.logout = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        await refresh_token_model_1.RefreshTokenModel.updateOne({ tokenHash: (0, auth_utils_1.hashToken)(token) }, { revokedAt: new Date() });
    }
    res.clearCookie("refreshToken");
    res.status(204).send();
});
exports.confirmAdult = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.auth) {
        throw new api_error_1.ApiError(401, "Unauthorized");
    }
    const user = await user_model_1.UserModel.findByIdAndUpdate(req.auth.userId, { isAdultVerified: true }, { new: true }).select("-passwordHash");
    if (!user) {
        throw new api_error_1.ApiError(404, "User not found");
    }
    res.json(user);
});
