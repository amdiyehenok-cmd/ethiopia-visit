// prisma.config.ts
import { config as dotenvConfig } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local first (Next.js standard) + fallback to .env
dotenvConfig({ path: ".env.local" });
dotenvConfig({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // ✅ Use DIRECT_URL for Prisma CLI (migrations, generate, db push, etc.)
    url: process.env.DIRECT_URL,
  },
})