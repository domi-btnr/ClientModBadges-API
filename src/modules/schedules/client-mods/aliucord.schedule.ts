import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { AliucordProvider } from "#providers/aliucord/aliucord.provider.js";
import { toSyncedBadges } from "#providers/aliucord/mapper/to-synced-badges.mapper.js";

import { BadgeSyncSchedule } from "../badge-sync.schedule.js";
import { BadgeSyncService } from "../badge-sync.service.js";
import { SyncedBadge } from "../dto/synced-badge.dto.js";

@Injectable()
export class AliucordSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.Aliucord;

  constructor(
    private readonly aliucordProvider: AliucordProvider,
    badgeSyncService: BadgeSyncService,
    logger: PinoLogger
  ) {
    super(badgeSyncService, logger);
    logger.setContext(AliucordSchedule.name);
  }

  @Cron(CronExpression.EVERY_HOUR, { name: "aliucord-badges" })
  override run(): Promise<void> {
    return super.run();
  }

  protected async fetchBadges(): Promise<SyncedBadge[]> {
    return toSyncedBadges(await this.aliucordProvider.getBadges());
  }
}
