"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const api_error_1 = require("../lib/api-error");
const requireRole = (...roles) => (req, _res, next) => {
    if (!req.auth) {
        throw new api_error_1.ApiError(401, "Unauthorized");
    }
    if (!roles.includes(req.auth.role)) {
        throw new api_error_1.ApiError(403, "Insufficient permissions");
    }
    next();
};
exports.requireRole = requireRole;
