import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { approveCreator, getCreatorProfile, upsertCreatorProfile } from "./creator.controller";

export const creatorRouter = Router();

creatorRouter.post("/creator/profile", requireAuth, requireRole("creator"), upsertCreatorProfile);
creatorRouter.patch("/creator/profile", requireAuth, requireRole("creator"), upsertCreatorProfile);
creatorRouter.get("/creator/:creatorId/profile", requireAuth, getCreatorProfile);
creatorRouter.post("/admin/creators/:creatorId/approve", requireAuth, requireRole("admin"), approveCreator);
