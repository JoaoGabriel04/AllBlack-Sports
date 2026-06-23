import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config();

// DIRECT_URL = URL sem -pooler, necessária para migrations no Neon
// DATABASE_URL = URL com -pooler, usada no runtime
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
