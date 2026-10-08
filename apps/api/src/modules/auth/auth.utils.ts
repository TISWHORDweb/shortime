import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { UserRole } from "../users/user.model";

interface JwtPayload {
  sub: string;
  role: UserRole;
}

const accessTokenTtl: jwt.SignOptions["expiresIn"] = env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"];
const refreshTokenTtl: jwt.SignOptions["expiresIn"] = `${env.REFRESH_TOKEN_TTL_DAYS}d` as jwt.SignOptions["expiresIn"];

export const signAccessToken = (userId: string, role: UserRole): string =>
  jwt.sign({ sub: userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: accessTokenTtl });

export const signRefreshToken = (userId: string, role: UserRole): string =>
  jwt.sign({ sub: userId, role }, env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenTtl });

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

export const hashToken = (token: string): string => crypto.createHash("sha256").update(token).digest("hex");
