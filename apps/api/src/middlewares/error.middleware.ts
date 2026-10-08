import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../lib/api-error";

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation failed", issues: err.issues });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
