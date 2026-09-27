import axios from "axios";
import { PinoLogger } from "nestjs-pino";
import type { Mock, MockInstance } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncService } from "../../badge-sync.service.js";
import { AliucordSchedule } from "./aliucord.schedule.js";

describe("AliucordSchedule", () => {
  let schedule: AliucordSchedule;
  let get: MockInstance;
  let replaceBadges: Mock;

  beforeEach(() => {
    get = vi.spyOn(axios, "get");
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });
    const logger = { setContext: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    schedule = new AliucordSchedule({ replaceBadges } as unknown as BadgeSyncService, logger as unknown as PinoLogger);
  });

  afterEach(() => vi.restoreAllMocks());

  it("should fetch the Aliucord badge data", async () => {
    get.mockResolvedValue({ data: { users: {} } });

    await schedule.run();

    expect(get).toHaveBeenCalledWith("https://badges.aliucord.com/badges.json", {
      headers: { "Cache-Control": "no-cache" },
      timeout: 10_000
    });
  });

  it("should sync the mapped Aliucord badges", async () => {
    get.mockResolvedValue({
      data: {
        users: {
          "324622488644616195": {
            roles: ["dev"],
            custom: [{ url: "https://cdn.discordapp.com/emojis/859801776232202280.png?size=48", text: "blobcatcozy" }]
          },
          "343383572805058560": {
            roles: ["dev", "contributor"]
          }
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

  it("should not sync when the Aliucord request fails", async () => {
    get.mockRejectedValue(new Error("Network error"));

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
  });
});
