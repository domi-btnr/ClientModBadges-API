import { PinoLogger } from "nestjs-pino";
import type { Mock } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncService } from "../badge-sync.service.js";
import { BetterDiscordSchedule } from "./betterdiscord.schedule.js";

describe("BetterDiscordSchedule", () => {
  let schedule: BetterDiscordSchedule;
  let replaceBadges: Mock;

  beforeEach(() => {
    const getDeveloperIds = vi.fn().mockResolvedValue(["249746236008169473", "515780151791976453"]);
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });
    const logger = { setContext: vi.fn(), warn: vi.fn(), error: vi.fn() };

    schedule = new BetterDiscordSchedule(
      { getDeveloperIds },
      { replaceBadges } as unknown as BadgeSyncService,
      logger as unknown as PinoLogger
    );
  });

  it("should sync the developer badges of the BetterDiscord developers", async () => {
    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.BetterDiscord, [
      { userId: "249746236008169473", name: "Developer" },
      { userId: "515780151791976453", name: "Developer" }
    ]);
  });
});
