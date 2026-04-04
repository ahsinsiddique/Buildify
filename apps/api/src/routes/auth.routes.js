import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authRoutes = Router();

authRoutes.post("/register", asyncHandler(register));
authRoutes.post("/login", asyncHandler(login));
