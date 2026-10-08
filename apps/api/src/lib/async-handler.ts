import { NextFunction, Request, Response } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (handler: Handler) => (req: Request, res: Response, next: NextFunction): void => {
  handler(req, res, next).catch(next);
};
