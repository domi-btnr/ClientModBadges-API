import { PinoLogger } from "nestjs-pino";
import type { Mock } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { VencordProvider } from "#providers/vencord/vencord.provider.js";

import { BadgeSyncService } from "../badge-sync.service.js";
import { VencordSchedule } from "./vencord.schedule.js";

const DONORS = {
  "343383572805058560": [
    {
      badge: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
    },
    {
      tooltip: "read if cute",
      badge: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
    }
  ]
};

const DONOR_BADGES = [
  {
    userId: "343383572805058560",
    name: undefined,
    image: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
  },
  {
    userId: "343383572805058560",
    name: "read if cute",
    image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
  }
];

describe("VencordSchedule", () => {
  let schedule: VencordSchedule;
  let getContributorIds: Mock;
  let getDonorBadges: Mock;
  let replaceBadges: Mock;

  beforeEach(() => {
    getContributorIds = vi.fn().mockResolvedValue(["343383572805058560", "354191516979429376"]);
    getDonorBadges = vi.fn().mockResolvedValue(DONORS);
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });
    const logger = { setContext: vi.fn(), warn: vi.fn(), error: vi.fn() };

    schedule = new VencordSchedule(
      { getContributorIds, getDonorBadges } as unknown as VencordProvider,
      { replaceBadges } as unknown as BadgeSyncService,
      logger as unknown as PinoLogger
    );
  });

  it("should sync contributors and donor badges together", async () => {
    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Vencord, [
      { userId: "343383572805058560", name: "Contributor" },
      { userId: "354191516979429376", name: "Contributor" },
      ...DONOR_BADGES
    ]);
  });

  it("should sync donor badges when no contributors are found", async () => {
    getContributorIds.mockResolvedValue([]);

    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Vencord, DONOR_BADGES);
  });

  it("should not sync when the contributors can't be fetched", async () => {
    getContributorIds.mockRejectedValue(new Error("GitHub is down"));

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
  });

  it("should not sync when the donor badges can't be fetched", async () => {
    getDonorBadges.mockRejectedValue(new Error("Vencord's Badge API is down"));

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
  });
});
