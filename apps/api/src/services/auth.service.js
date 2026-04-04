import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../config/db.js";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http-error.js";

export async function registerUser(payload) {
  const passwordHash = await bcrypt.hash(payload.password, 10);

  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [payload.name, payload.email, passwordHash, payload.role]
  );

  return result.rows[0];
}

export async function loginUser(payload) {
  const result = await db.query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
    [payload.email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(payload.password, user.password_hash);

  if (!isMatch) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}
