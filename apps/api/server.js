import { app } from "./src/app.js";
import { initializeDatabase } from "./src/config/bootstrap-db.js";
import { env } from "./src/config/env.js";

async function startServer() {
  await initializeDatabase();

  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
