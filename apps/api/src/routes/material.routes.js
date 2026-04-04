import { Router } from "express";

import {
  createMaterial,
  deleteMaterial,
  getMaterial,
  listMaterials,
  updateMaterial
} from "../controllers/material.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const materialRoutes = Router();

materialRoutes.use(asyncHandler(requireAuth));
materialRoutes.get("/", asyncHandler(listMaterials));
materialRoutes.get("/:id", asyncHandler(getMaterial));
materialRoutes.post("/", asyncHandler(requireRole("admin", "manager")), asyncHandler(createMaterial));
materialRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager")), asyncHandler(updateMaterial));
materialRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteMaterial));
