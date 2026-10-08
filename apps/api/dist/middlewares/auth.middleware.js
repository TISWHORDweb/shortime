"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const api_error_1 = require("../lib/api-error");
const auth_utils_1 = require("../modules/auth/auth.utils");
const requireAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        throw new api_error_1.ApiError(401, "Missing or invalid access token");
    }
    const token = authHeader.replace("Bearer ", "");
    const payload = (0, auth_utils_1.verifyAccessToken)(token);
    req.auth = { userId: payload.sub, role: payload.role };
    next();
};
exports.requireAuth = requireAuth;
