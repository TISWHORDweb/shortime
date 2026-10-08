"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    MONGODB_URI: zod_1.z.string().min(1, "MONGODB_URI is required"),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 chars"),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 chars"),
    ACCESS_TOKEN_TTL: zod_1.z.string().default("15m"),
    REFRESH_TOKEN_TTL_DAYS: zod_1.z.coerce.number().default(7),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:3000")
});
exports.env = envSchema.parse(process.env);
