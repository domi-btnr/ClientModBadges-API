import type { SyncedBadge } from "#modules/schedules/dto/synced-badge.dto.js";
import type { AliucordBadgesDTO } from "#providers/aliucord/dto/aliucord-badges.dto.js";

export function toSyncedBadges({ users }: AliucordBadgesDTO): SyncedBadge[] {
  const badges: SyncedBadge[] = [];

  for (const [userId, { roles, custom }] of Object.entries(users ?? {})) {
    for (const role of roles ?? []) badges.push({ userId, name: role });

    for (const { text, url } of custom ?? []) badges.push({ userId, name: text, image: url });
  }

  return badges;
}
