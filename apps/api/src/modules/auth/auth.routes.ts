import { Router } from "express";
import { confirmAdult, login, logout, refresh, register } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.post("/confirm-adult", requireAuth, confirmAdult);
