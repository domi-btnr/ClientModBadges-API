import { Injectable } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

import { ClientMods } from "#modules/prisma/generated/enums.js";
import { PrismaService } from "#modules/prisma/prisma.service.js";

import { SyncedBadge } from "./dto/synced-badge.dto.js";
import { normalizeBadges } from "./utils/normalize-badges.js";

const TRANSACTION_TIMEOUT_MS = 60_000;

export type BadgeSyncResult = {
  badges: number;
  users: number;
};

@Injectable()
export class BadgeSyncService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(BadgeSyncService.name);
  }

  async replaceBadges(clientMod: ClientMods, badges: SyncedBadge[]): Promise<BadgeSyncResult> {
    const normalized = normalizeBadges(badges);
    const userIds = [...new Set(normalized.map(({ userId }) => userId))];

    await this.prismaService.$transaction(
      async tx => {
        await tx.user.createMany({ data: userIds.map(id => ({ id })), skipDuplicates: true });
        await tx.badge.deleteMany({ where: { clientMod } });
        await tx.badge.createMany({
          data: normalized.map(({ userId, name, image }) => ({ userId, clientMod, name, image }))
        });
        await tx.user.deleteMany({ where: { badges: { none: {} } } });
      },
      { timeout: TRANSACTION_TIMEOUT_MS }
    );

    this.logger.info(`[${clientMod}] Synced ${normalized.length} badges for ${userIds.length} users`);
    return { badges: normalized.length, users: userIds.length };
  }
}
