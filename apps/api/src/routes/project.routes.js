import { Router } from "express";

import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject
} from "../controllers/project.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const projectRoutes = Router();

projectRoutes.use(asyncHandler(requireAuth));
projectRoutes.get("/", asyncHandler(listProjects));
projectRoutes.get("/:id", asyncHandler(getProject));
projectRoutes.post("/", asyncHandler(requireRole("admin", "manager")), asyncHandler(createProject));
projectRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager")), asyncHandler(updateProject));
projectRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteProject));
