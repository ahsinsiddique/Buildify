import { Router } from "express";

import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient
} from "../controllers/client.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const clientRoutes = Router();

clientRoutes.use(asyncHandler(requireAuth));
clientRoutes.get("/", asyncHandler(listClients));
clientRoutes.get("/:id", asyncHandler(getClient));
clientRoutes.post("/", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(createClient));
clientRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(updateClient));
clientRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteClient));
