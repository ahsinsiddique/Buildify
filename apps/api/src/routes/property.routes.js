import { Router } from "express";

import {
  createProperty,
  deleteProperty,
  getProperty,
  listProperties,
  updateProperty
} from "../controllers/property.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const propertyRoutes = Router();

propertyRoutes.use(asyncHandler(requireAuth));
propertyRoutes.get("/", asyncHandler(listProperties));
propertyRoutes.get("/:id", asyncHandler(getProperty));
propertyRoutes.post("/", asyncHandler(requireRole("admin", "manager")), asyncHandler(createProperty));
propertyRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager")), asyncHandler(updateProperty));
propertyRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteProperty));
