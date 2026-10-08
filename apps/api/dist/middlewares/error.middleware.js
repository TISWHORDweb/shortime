"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const api_error_1 = require("../lib/api-error");
const errorMiddleware = (err, _req, res, _next) => {
    if (err instanceof api_error_1.ApiError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({ message: "Validation failed", issues: err.issues });
        return;
    }
    res.status(500).json({ message: "Internal server error" });
};
exports.errorMiddleware = errorMiddleware;
