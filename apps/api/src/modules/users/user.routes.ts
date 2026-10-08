import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { getMe, patchMe } from "./user.controller";

export const userRouter = Router();

userRouter.get("/me", requireAuth, getMe);
userRouter.patch("/me", requireAuth, patchMe);
