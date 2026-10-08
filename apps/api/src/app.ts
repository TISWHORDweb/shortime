import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { creatorRouter } from "./modules/creators/creator.routes";
import { userRouter } from "./modules/users/user.routes";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", creatorRouter);

app.use(errorMiddleware);
