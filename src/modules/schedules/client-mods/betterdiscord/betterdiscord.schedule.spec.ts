import { PinoLogger } from "nestjs-pino";
import type { Mock } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncService } from "../../badge-sync.service.js";
import { BetterDiscordSchedule } from "./betterdiscord.schedule.js";

describe("BetterDiscordSchedule", () => {
  let schedule: BetterDiscordSchedule;
  let replaceBadges: Mock;

  beforeEach(() => {
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });
    const logger = { setContext: vi.fn(), warn: vi.fn(), error: vi.fn() };

    schedule = new BetterDiscordSchedule(
      { replaceBadges } as unknown as BadgeSyncService,
      logger as unknown as PinoLogger
    );
  });

  it("should sync the developer badges of the BetterDiscord developers", async () => {
    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.BetterDiscord, [
      { userId: "249746236008169473", name: "developer" },
      { userId: "515780151791976453", name: "developer" },
      { userId: "917630027477159986", name: "developer" },
      { userId: "619261917352951815", name: "developer" }
    ]);
  });
});
