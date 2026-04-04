import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing bearer token"));
  }

  const token = header.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, "Access denied"));
    }

    next();
  };
}
