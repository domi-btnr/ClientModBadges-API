import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncSchedule } from "../../badge-sync.schedule.js";
import { BadgeSyncService } from "../../badge-sync.service.js";
import { SyncedBadge } from "../../dto/synced-badge.dto.js";

const DEVELOPERS = [
  "249746236008169473", // Zerebos
  "515780151791976453", // Doggybootsy
  "917630027477159986", // zrodevkaan
  "619261917352951815" // TheLazySquid
];

/**
 * No `@Cron` needed: the developers are a hardcoded list that only changes with a deploy,
 * and every schedule already runs once on app start.
 */
@Injectable()
export class BetterDiscordSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.BetterDiscord;

  constructor(badgeSyncService: BadgeSyncService, logger: PinoLogger) {
    super(badgeSyncService, logger);
    logger.setContext(BetterDiscordSchedule.name);
  }

  protected fetchBadges(): Promise<SyncedBadge[]> {
    return Promise.resolve(DEVELOPERS.map(userId => ({ userId, name: "developer" })));
  }
}
