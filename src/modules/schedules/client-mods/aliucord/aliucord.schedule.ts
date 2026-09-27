import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncSchedule, REQUEST_CONFIG } from "../../badge-sync.schedule.js";
import { BadgeSyncService } from "../../badge-sync.service.js";
import { SyncedBadge } from "../../dto/synced-badge.dto.js";
import { AliucordBadgesDTO } from "./dto/aliucord-badges.dto.js";
import { toSyncedBadges } from "./mapper/to-synced-badges.mapper.js";

const BADGES_URL = "https://badges.aliucord.com/badges.json";

@Injectable()
export class AliucordSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.Aliucord;

  constructor(badgeSyncService: BadgeSyncService, logger: PinoLogger) {
    super(badgeSyncService, logger);
    logger.setContext(AliucordSchedule.name);
  }

  @Cron(CronExpression.EVERY_HOUR, { name: "aliucord-badges" })
  override run(): Promise<void> {
    return super.run();
  }

  protected async fetchBadges(): Promise<SyncedBadge[]> {
    this.logger.debug("Fetching Aliucord badges");
    const { data } = await axios.get<AliucordBadgesDTO>(BADGES_URL, REQUEST_CONFIG);
    return toSyncedBadges(data);
  }
}
