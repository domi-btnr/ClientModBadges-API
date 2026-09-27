/**
 * Intermediate badge shape produced by provider mappers and consumed by the badge sync.
 * `image` is only set for custom badges that ship their own external image URL.
 * `name` may be missing for custom badges without a label, as long as they have an image.
 */
export type SyncedBadge = {
  userId: string;
  name?: string;
  image?: string;
};
