import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from "prisma/config";

expand(config());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx src/modules/prisma/seed.ts"
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "postgres://admin:password@localhost:5432/clientmodbadges"
  }
});
