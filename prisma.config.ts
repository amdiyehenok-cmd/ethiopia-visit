// prisma.config.ts
import 'dotenv/config'                    // Loads .env.local + .env automatically
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    // ✅ Use DIRECT_URL for Prisma CLI commands (generate, db push, migrate, etc.)
    // This is required for Neon + Prisma 7
    url: env('DIRECT_URL'),
  },
})