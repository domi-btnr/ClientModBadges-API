import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { BetterDiscordProvider } from "#providers/betterdiscord/betterdiscord.provider.js";

import { BadgeSyncSchedule } from "../badge-sync.schedule.js";
import { BadgeSyncService } from "../badge-sync.service.js";
import { SyncedBadge } from "../dto/synced-badge.dto.js";

/**
 * No `@Cron` needed: the developers are a hardcoded list that only changes with a deploy,
 * and every schedule already runs once on app start.
 */
@Injectable()
export class BetterDiscordSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.BetterDiscord;

  constructor(
    private readonly betterDiscordProvider: BetterDiscordProvider,
    badgeSyncService: BadgeSyncService,
    logger: PinoLogger
  ) {
    super(badgeSyncService, logger);
    logger.setContext(BetterDiscordSchedule.name);
  }

  protected async fetchBadges(): Promise<SyncedBadge[]> {
    const developerIds = await this.betterDiscordProvider.getDeveloperIds();
    return developerIds.map(userId => ({ userId, name: "Developer" }));
  }
}
