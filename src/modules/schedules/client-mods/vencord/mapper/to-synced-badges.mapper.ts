import type { SyncedBadge } from "../../../dto/synced-badge.dto.js";
import type { VencordDonorBadgesDTO } from "../dto/vencord-donor-badges.dto.js";

export function toSyncedBadges(contributorIds: string[], donors: VencordDonorBadgesDTO): SyncedBadge[] {
  const badges: SyncedBadge[] = contributorIds.map(userId => ({ userId, name: "Contributor" }));

  for (const [userId, userBadges] of Object.entries(donors ?? {})) {
    for (const { tooltip, badge } of userBadges ?? []) badges.push({ userId, name: tooltip, image: badge });
  }

  return badges;
}
