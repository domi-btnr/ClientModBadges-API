import { OnApplicationBootstrap } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncService } from "./badge-sync.service.js";
import { SyncedBadge } from "./dto/synced-badge.dto.js";

export const REQUEST_CONFIG = { headers: { "Cache-Control": "no-cache" }, timeout: 10_000 };

/**
 * Base class for per-client-mod sync schedules. Subclasses provide the fetch logic and
 * schedule `run()` with `@Cron`. Every schedule also runs once on app start.
 *
 * A failed fetch or an empty result leaves the existing badges untouched.
 */
export abstract class BadgeSyncSchedule implements OnApplicationBootstrap {
  protected abstract readonly clientMod: ClientMods;
  private running = false;

  constructor(
    private readonly badgeSyncService: BadgeSyncService,
    protected readonly logger: PinoLogger
  ) {}

  protected abstract fetchBadges(): Promise<SyncedBadge[]>;

  /** Runs in the background, so a slow badge source doesn't delay the app start. */
  onApplicationBootstrap(): void {
    void this.run();
  }

  async run(): Promise<void> {
    if (this.running) {
      this.logger.warn(`[${this.clientMod}] Badge Sync is still running, skipping this run`);
      return;
    }

    this.running = true;
    try {
      const badges = await this.fetchBadges();
      if (badges.length === 0) {
        this.logger.warn(`[${this.clientMod}] Fetched 0 badges, keeping existing badges`);
        return;
      }

      await this.badgeSyncService.replaceBadges(this.clientMod, badges);
    } catch (error) {
      this.logger.error(error, `[${this.clientMod}] Badge Sync failed`);
    } finally {
      this.running = false;
    }
  }
}
