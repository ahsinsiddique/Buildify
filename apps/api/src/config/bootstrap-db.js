import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import pg from "pg";

import { env } from "./env.js";

const { Client } = pg;

function quoteIdentifier(value) {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

async function ensureDatabaseExists() {
  const adminClient = new Client({
    connectionString: env.adminDatabaseUrl
  });

  await adminClient.connect();

  try {
    const result = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [env.databaseName]
    );

    if (result.rowCount === 0) {
      await adminClient.query(
        `CREATE DATABASE ${quoteIdentifier(env.databaseName)}`
      );
    }
  } finally {
    await adminClient.end();
  }
}

async function applySchema() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = path.dirname(currentFilePath);
  const schemaPath = path.resolve(currentDirPath, "../../../../database/schema.sql");
  const schemaSql = await readFile(schemaPath, "utf8");

  const appClient = new Client({
    connectionString: env.databaseUrl
  });

  await appClient.connect();

  try {
    await appClient.query(schemaSql);
  } finally {
    await appClient.end();
  }
}

export async function initializeDatabase() {
  await ensureDatabaseExists();
  await applySchema();
}
