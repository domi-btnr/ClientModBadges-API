import { PinoLogger } from "nestjs-pino";
import type { Mock } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncSchedule } from "./badge-sync.schedule.js";
import { BadgeSyncService } from "./badge-sync.service.js";
import { SyncedBadge } from "./dto/synced-badge.dto.js";

class TestSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.Vencord;

  constructor(
    public fetchBadges: Mock<() => Promise<SyncedBadge[]>>,
    badgeSyncService: BadgeSyncService,
    logger: PinoLogger
  ) {
    super(badgeSyncService, logger);
  }
}

const BADGES: SyncedBadge[] = [{ userId: "354191516979429376", name: "Contributor" }];

describe("BadgeSyncSchedule", () => {
  let schedule: TestSchedule;
  let fetchBadges: Mock<() => Promise<SyncedBadge[]>>;
  let replaceBadges: Mock;
  let logger: { warn: Mock; error: Mock };

  beforeEach(() => {
    fetchBadges = vi.fn<() => Promise<SyncedBadge[]>>().mockResolvedValue(BADGES);
    replaceBadges = vi.fn().mockResolvedValue({ badges: 1, users: 1 });
    logger = { warn: vi.fn(), error: vi.fn() };

    schedule = new TestSchedule(
      fetchBadges,
      { replaceBadges } as unknown as BadgeSyncService,
      logger as unknown as PinoLogger
    );
  });

  it("should replace the badges with the fetched ones", async () => {
    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Vencord, BADGES);
  });

  it("should keep existing badges when the fetch returns nothing", async () => {
    fetchBadges.mockResolvedValue([]);

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith("[Vencord] Fetched 0 badges, keeping existing badges");
  });

  it("should keep existing badges and log when the fetch fails", async () => {
    const error = new Error("Network error");
    fetchBadges.mockRejectedValue(error);

    await expect(schedule.run()).resolves.toBeUndefined();

    expect(replaceBadges).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith(error, "[Vencord] Badge Sync failed");
  });

  it("should log when replacing the badges fails", async () => {
    const error = new Error("Database error");
    replaceBadges.mockRejectedValue(error);

    await expect(schedule.run()).resolves.toBeUndefined();

    expect(logger.error).toHaveBeenCalledWith(error, "[Vencord] Badge Sync failed");
  });

  it("should skip a run while the previous one is still running", async () => {
    let finishFetch!: (badges: SyncedBadge[]) => void;
    fetchBadges.mockReturnValueOnce(new Promise(resolve => (finishFetch = resolve)));

    const firstRun = schedule.run();
    await schedule.run();

    expect(fetchBadges).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith("[Vencord] Badge Sync is still running, skipping this run");

    finishFetch(BADGES);
    await firstRun;
    expect(replaceBadges).toHaveBeenCalledTimes(1);
  });

  it("should run again after a failed run", async () => {
    fetchBadges.mockRejectedValueOnce(new Error("Network error"));

    await schedule.run();
    await schedule.run();

    expect(fetchBadges).toHaveBeenCalledTimes(2);
    expect(replaceBadges).toHaveBeenCalledTimes(1);
  });

  it("should run once on app start without blocking it", async () => {
    let finishFetch!: (badges: SyncedBadge[]) => void;
    fetchBadges.mockReturnValueOnce(new Promise(resolve => (finishFetch = resolve)));

    expect(schedule.onApplicationBootstrap()).toBeUndefined();
    expect(fetchBadges).toHaveBeenCalledTimes(1);
    expect(replaceBadges).not.toHaveBeenCalled();

    finishFetch(BADGES);
    await vi.waitFor(() => expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Vencord, BADGES));
  });
});
