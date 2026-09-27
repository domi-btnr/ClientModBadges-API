import type { SyncedBadge } from "../dto/synced-badge.dto.js";

const SNOWFLAKE_REGEX = /^[0-9]{17,20}$/;

export function normalizeBadges(badges: SyncedBadge[]): SyncedBadge[] {
  const unique = new Map<string, SyncedBadge>();

  for (const badge of badges) {
    const userId = badge.userId?.trim();
    const name = badge.name?.trim() || undefined;
    const image = badge.image?.trim() || undefined;
    if (!userId || !SNOWFLAKE_REGEX.test(userId) || (!name && !image)) continue;

    const key = JSON.stringify([userId, name, image]);
    if (!unique.has(key)) unique.set(key, { userId, name, image });
  }

  return [...unique.values()];
}
