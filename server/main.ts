import "dotenv/config";
import { validateEnv, getAllowedOrigins } from "./config/env";
import { createApp } from "./app";
import { ensureResetTokenColumns } from "./db/queries/auth";

async function main() {
  validateEnv();

  await ensureResetTokenColumns();

  const PORT = 4000;
  const allowedOrigins = getAllowedOrigins();
  const app = createApp({ allowedOrigins });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

