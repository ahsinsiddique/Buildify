import { Router } from "express";

import {
  createConsultation,
  deleteConsultation,
  getConsultation,
  listConsultations,
  updateConsultation
} from "../controllers/consultation.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const consultationRoutes = Router();

consultationRoutes.use(asyncHandler(requireAuth));
consultationRoutes.get("/", asyncHandler(listConsultations));
consultationRoutes.get("/:id", asyncHandler(getConsultation));
consultationRoutes.post("/", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(createConsultation));
consultationRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(updateConsultation));
consultationRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteConsultation));
