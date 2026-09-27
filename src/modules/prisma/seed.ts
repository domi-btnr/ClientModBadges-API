import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { Pool } from "pg";

import { PrismaClient } from "./generated/client.js";
import { ClientMods } from "./generated/enums.js";

expand(config());

const connectionString = process.env.DATABASE_URL ?? "postgres://admin:password@localhost:5432/clientmodbadges";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: "354191516979429376",
      badges: {
        create: [
          {
            id: "a234346e-1d85-4dc3-8393-c85e957c37df",
            clientMod: ClientMods.Vencord,
            name: "Contributor"
          }
        ]
      }
    }
  });
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
