"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchMe = exports.getMe = void 0;
const zod_1 = require("zod");
const api_error_1 = require("../../lib/api-error");
const async_handler_1 = require("../../lib/async-handler");
const user_model_1 = require("./user.model");
exports.getMe = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.auth) {
        throw new api_error_1.ApiError(401, "Unauthorized");
    }
    const user = await user_model_1.UserModel.findById(req.auth.userId).select("-passwordHash");
    if (!user) {
        throw new api_error_1.ApiError(404, "User not found");
    }
    res.json(user);
});
const updateMeSchema = zod_1.z.object({
    isAdultVerified: zod_1.z.boolean().optional()
});
exports.patchMe = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.auth) {
        throw new api_error_1.ApiError(401, "Unauthorized");
    }
    const payload = updateMeSchema.parse(req.body);
    const user = await user_model_1.UserModel.findByIdAndUpdate(req.auth.userId, payload, { new: true }).select("-passwordHash");
    if (!user) {
        throw new api_error_1.ApiError(404, "User not found");
    }
    res.json(user);
});
