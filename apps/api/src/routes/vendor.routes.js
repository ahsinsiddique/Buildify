import { Router } from "express";

import {
  createVendor,
  deleteVendor,
  getVendor,
  listVendors,
  updateVendor
} from "../controllers/vendor.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const vendorRoutes = Router();

vendorRoutes.use(asyncHandler(requireAuth));
vendorRoutes.get("/", asyncHandler(listVendors));
vendorRoutes.get("/:id", asyncHandler(getVendor));
vendorRoutes.post("/", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(createVendor));
vendorRoutes.patch("/:id", asyncHandler(requireRole("admin", "manager", "accountant")), asyncHandler(updateVendor));
vendorRoutes.delete("/:id", asyncHandler(requireRole("admin")), asyncHandler(deleteVendor));
