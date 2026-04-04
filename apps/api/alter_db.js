import { db } from "./src/config/db.js";

async function main() {
  const client = await db.connect();
  try {
    await client.query("ALTER TABLE expenses ADD COLUMN IF NOT EXISTS worker_id INT REFERENCES workers(id) ON DELETE SET NULL");
    console.log("Success! Added worker_id to expenses table.");
  } catch (error) {
    console.error("Error altering table", error);
  } finally {
    client.release();
    db.end();
  }
}

main();
