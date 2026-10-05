import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { toSyncedBadges } from "#providers/vencord/mapper/to-synced-badges.mapper.js";
import { VencordProvider } from "#providers/vencord/vencord.provider.js";

import { BadgeSyncSchedule } from "../badge-sync.schedule.js";
import { BadgeSyncService } from "../badge-sync.service.js";
import { SyncedBadge } from "../dto/synced-badge.dto.js";

@Injectable()
export class VencordSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.Vencord;

  constructor(
    private readonly vencordProvider: VencordProvider,
    badgeSyncService: BadgeSyncService,
    logger: PinoLogger
  ) {
    super(badgeSyncService, logger);
    logger.setContext(VencordSchedule.name);
  }

  @Cron(CronExpression.EVERY_HOUR, { name: "vencord-badges" })
  override run(): Promise<void> {
    return super.run();
  }

  protected async fetchBadges(): Promise<SyncedBadge[]> {
    const [contributorIds, donors] = await Promise.all([
      this.vencordProvider.getContributorIds(),
      this.vencordProvider.getDonorBadges()
    ]);
    return toSyncedBadges(contributorIds, donors);
  }
}
