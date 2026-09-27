export type VencordDonorBadgeDTO = {
  tooltip?: string;
  badge: string;
};

export type VencordDonorBadgesDTO = Record<string, VencordDonorBadgeDTO[]>;
