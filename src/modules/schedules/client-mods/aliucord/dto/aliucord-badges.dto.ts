export type AliucordCustomBadgeDTO = {
  text: string;
  url: string;
};

export type AliucordUserDTO = {
  roles: string[];
  custom?: AliucordCustomBadgeDTO[];
};

export type AliucordBadgesDTO = {
  users: Record<string, AliucordUserDTO>;
};
