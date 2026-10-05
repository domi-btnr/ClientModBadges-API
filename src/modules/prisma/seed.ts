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

const USERS: {
  id: string;
  badges: {
    clientMod: ClientMods;
    name?: string;
    image?: string;
  }[];
}[] = [
  {
    id: "343383572805058560",
    badges: [
      { clientMod: ClientMods.Aliucord, name: "dev" },
      { clientMod: ClientMods.Aliucord, name: "contributor" },
      { clientMod: ClientMods.Vencord, name: "Contributor" },
      {
        clientMod: ClientMods.Vencord,
        image: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
      },
      {
        clientMod: ClientMods.Vencord,
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      }
    ]
  },
  {
    id: "354191516979429376",
    badges: [{ clientMod: ClientMods.Vencord, name: "Contributor" }]
  },
  {
    id: "324622488644616195",
    badges: [
      { clientMod: ClientMods.Aliucord, name: "dev" },
      {
        clientMod: ClientMods.Aliucord,
        name: "blobcatcozy",
        image: "https://cdn.discordapp.com/emojis/859801776232202280.png?size=48"
      }
    ]
  },
  {
    id: "249746236008169473",
    badges: [{ clientMod: ClientMods.BetterDiscord, name: "Developer" }]
  },
  {
    id: "515780151791976453",
    badges: [{ clientMod: ClientMods.BetterDiscord, name: "Developer" }]
  }
];

async function seed() {
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  for (const { id, badges } of USERS) {
    await prisma.user.create({ data: { id, badges: { create: badges } } });
  }
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
