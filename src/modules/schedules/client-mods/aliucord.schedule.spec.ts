import { PinoLogger } from "nestjs-pino";
import type { Mock } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { AliucordProvider } from "#providers/aliucord/aliucord.provider.js";

import { BadgeSyncService } from "../badge-sync.service.js";
import { AliucordSchedule } from "./aliucord.schedule.js";

describe("AliucordSchedule", () => {
  let schedule: AliucordSchedule;
  let getBadges: Mock;
  let replaceBadges: Mock;

  beforeEach(() => {
    getBadges = vi.fn();
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });
    const logger = { setContext: vi.fn(), warn: vi.fn(), error: vi.fn() };

    schedule = new AliucordSchedule(
      { getBadges } as unknown as AliucordProvider,
      { replaceBadges } as unknown as BadgeSyncService,
      logger as unknown as PinoLogger
    );
  });

  it("should sync the mapped Aliucord badges", async () => {
    getBadges.mockResolvedValue({
      users: {
        "324622488644616195": {
          roles: ["dev"],
          custom: [{ url: "https://cdn.discordapp.com/emojis/859801776232202280.png?size=48", text: "blobcatcozy" }]
        },
        "343383572805058560": {
          roles: ["dev", "contributor"]
        }
      }
    });

    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Aliucord, [
      { userId: "324622488644616195", name: "dev" },
      {
        userId: "324622488644616195",
        name: "blobcatcozy",
        image: "https://cdn.discordapp.com/emojis/859801776232202280.png?size=48"
      },
      { userId: "343383572805058560", name: "dev" },
      { userId: "343383572805058560", name: "contributor" }
    ]);
  });

  it("should not sync when the Aliucord provider fails", async () => {
    getBadges.mockRejectedValue(new Error("Network error"));

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
  });
});
