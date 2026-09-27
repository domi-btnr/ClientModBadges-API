import { PinoLogger } from "nestjs-pino";
import type { Mock } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { PrismaService } from "#modules/prisma/prisma.service.js";

import { BadgeSyncService } from "./badge-sync.service.js";

describe("BadgeSyncService", () => {
  let badgeSyncService: BadgeSyncService;
  let calls: string[];
  let tx: {
    user: { createMany: Mock; deleteMany: Mock };
    badge: { createMany: Mock; deleteMany: Mock };
  };
  let transaction: Mock;
  let logger: { setContext: Mock; info: Mock };

  beforeEach(() => {
    calls = [];
    const track = (name: string) => vi.fn(() => Promise.resolve(calls.push(name)));
    tx = {
      user: { createMany: track("user.createMany"), deleteMany: track("user.deleteMany") },
      badge: { createMany: track("badge.createMany"), deleteMany: track("badge.deleteMany") }
    };
    transaction = vi.fn((callback: (client: typeof tx) => Promise<void>) => callback(tx));
    logger = { setContext: vi.fn(), info: vi.fn() };

    badgeSyncService = new BadgeSyncService(
      { $transaction: transaction } as unknown as PrismaService,
      logger as unknown as PinoLogger
    );
  });

  it("should replace all badges of the client mod in one transaction", async () => {
    await badgeSyncService.replaceBadges(ClientMods.Vencord, [
      { userId: "343383572805058560", name: "Contributor" },
      { userId: "354191516979429376", name: "Contributor" },
      {
        userId: "343383572805058560",
        image: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
      },
      {
        userId: "343383572805058560",
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      },
      {
        userId: "343383572805058560",
        image: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
      }
    ]);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(transaction).toHaveBeenCalledWith(expect.any(Function), { timeout: 60_000 });
    expect(calls).toEqual(["user.createMany", "badge.deleteMany", "badge.createMany", "user.deleteMany"]);

    expect(tx.user.createMany).toHaveBeenCalledWith({
      data: [{ id: "343383572805058560" }, { id: "354191516979429376" }],
      skipDuplicates: true
    });
    expect(tx.badge.deleteMany).toHaveBeenCalledWith({ where: { clientMod: ClientMods.Vencord } });
    expect(tx.badge.createMany).toHaveBeenCalledWith({
      data: [
        { userId: "343383572805058560", clientMod: ClientMods.Vencord, name: "Contributor", image: undefined },
        { userId: "354191516979429376", clientMod: ClientMods.Vencord, name: "Contributor", image: undefined },
        {
          userId: "343383572805058560",
          clientMod: ClientMods.Vencord,
          name: undefined,
          image: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
        },
        {
          userId: "343383572805058560",
          clientMod: ClientMods.Vencord,
          name: "read if cute",
          image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
        },
        {
          userId: "343383572805058560",
          clientMod: ClientMods.Vencord,
          name: undefined,
          image: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
        }
      ]
    });
    expect(tx.user.deleteMany).toHaveBeenCalledWith({ where: { badges: { none: {} } } });
  });

  it("should normalize badges before writing them", async () => {
    const result = await badgeSyncService.replaceBadges(ClientMods.Vencord, [
      { userId: "343383572805058560", name: "Contributor" },
      { userId: "343383572805058560", name: "Contributor" },
      {
        userId: "343383572805058560",
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      },
      {
        userId: "343383572805058560",
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      },
      { userId: "0", name: "Contributor" },
      { userId: "354191516979429376", name: "" }
    ]);

    expect(tx.badge.createMany).toHaveBeenCalledWith({
      data: [
        { userId: "343383572805058560", clientMod: ClientMods.Vencord, name: "Contributor", image: undefined },
        {
          userId: "343383572805058560",
          clientMod: ClientMods.Vencord,
          name: "read if cute",
          image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
        }
      ]
    });
    expect(result).toEqual({ badges: 2, users: 1 });
  });

  it("should log and return the sync result", async () => {
    const result = await badgeSyncService.replaceBadges(ClientMods.Vencord, [
      { userId: "343383572805058560", name: "Contributor" },
      { userId: "354191516979429376", name: "Contributor" },
      {
        userId: "343383572805058560",
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      }
    ]);

    expect(result).toEqual({ badges: 3, users: 2 });
    expect(logger.info).toHaveBeenCalledWith("[Vencord] Synced 3 badges for 2 users");
  });

  it("should propagate transaction errors", async () => {
    const error = new Error("Transaction failed");
    transaction.mockRejectedValue(error);

    await expect(
      badgeSyncService.replaceBadges(ClientMods.Vencord, [{ userId: "343383572805058560", name: "Contributor" }])
    ).rejects.toBe(error);
    expect(logger.info).not.toHaveBeenCalled();
  });
});
