import dotenv from "dotenv";

import { getDatabaseUrls } from "./database-url.js";

dotenv.config();

const urls = getDatabaseUrls();

export const env = {
  port: Number(process.env.PORT ?? 5001),
  databaseUrl: urls.databaseUrl,
  adminDatabaseUrl: urls.adminDatabaseUrl,
  databaseName: urls.databaseName,
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d"
};
