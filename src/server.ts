import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();
    app.listen(config.port, () => {
      console.log(`Server listening on port http://localhost:${config.port}`);
    });
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

main();
