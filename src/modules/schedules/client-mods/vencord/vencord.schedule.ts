import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncSchedule, REQUEST_CONFIG } from "../../badge-sync.schedule.js";
import { BadgeSyncService } from "../../badge-sync.service.js";
import { SyncedBadge } from "../../dto/synced-badge.dto.js";
import { VencordDonorBadgesDTO } from "./dto/vencord-donor-badges.dto.js";
import { toSyncedBadges } from "./mapper/to-synced-badges.mapper.js";

const CONSTANTS_URL = "https://raw.githubusercontent.com/Vendicated/Vencord/main/src/utils/constants.ts";
const DONOR_BADGES_URL = "https://badges.vencord.dev/badges.json";

const CONTRIBUTOR_ID_REGEX = /id: ([0-9]{17,20})n/g;

@Injectable()
export class VencordSchedule extends BadgeSyncSchedule {
  protected readonly clientMod = ClientMods.Vencord;

  constructor(badgeSyncService: BadgeSyncService, logger: PinoLogger) {
    super(badgeSyncService, logger);
    logger.setContext(VencordSchedule.name);
  }

  @Cron(CronExpression.EVERY_HOUR, { name: "vencord-badges" })
  override run(): Promise<void> {
    return super.run();
  }

  protected async fetchBadges(): Promise<SyncedBadge[]> {
    const [contributorIds, donors] = await Promise.all([this.fetchContributorIds(), this.fetchDonorBadges()]);
    return toSyncedBadges(contributorIds, donors);
  }

  private async fetchContributorIds(): Promise<string[]> {
    this.logger.debug("Fetching Vencord contributors");
    const { data } = await axios.get<string>(CONSTANTS_URL, { ...REQUEST_CONFIG, responseType: "text" });
    return [...new Set(Array.from(data.matchAll(CONTRIBUTOR_ID_REGEX), ([, id]) => id))];
  }

  private async fetchDonorBadges(): Promise<VencordDonorBadgesDTO> {
    this.logger.debug("Fetching Vencord donor badges");
    const { data } = await axios.get<VencordDonorBadgesDTO>(DONOR_BADGES_URL, REQUEST_CONFIG);
    return data;
  }
}
