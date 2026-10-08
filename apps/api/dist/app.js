"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = require("./modules/auth/auth.routes");
const creator_routes_1 = require("./modules/creators/creator.routes");
const user_routes_1 = require("./modules/users/user.routes");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true
}));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
exports.app.use("/api", auth_routes_1.authRouter);
exports.app.use("/api", user_routes_1.userRouter);
exports.app.use("/api", creator_routes_1.creatorRouter);
exports.app.use(error_middleware_1.errorMiddleware);
