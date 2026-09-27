import { Prisma } from "#modules/prisma/generated/client.js";
import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeDTO } from "../dto/badge.dto.js";
import { UserDTO } from "../dto/user.dto.js";

export const USER_WITH_BADGES_INCLUDE = {
  badges: {
    select: {
      clientMod: true,
      name: true
    }
  }
} satisfies Prisma.UserInclude;

type DatabaseUser = Prisma.UserGetPayload<{ include: typeof USER_WITH_BADGES_INCLUDE; omit: { id: true } }>;

export type UserWithBadges = {
  user: DatabaseUser | null;
  replugged: BadgeDTO[];
};

function toBadgeImage(baseUrl: string, clientMod: ClientMods, name: string): string {
  const slug = name.toLowerCase().replaceAll(" ", "_");
  return `${baseUrl}/badges/${clientMod.toLowerCase()}/${slug}`;
}

export function toUserDTO({ user, replugged }: UserWithBadges, baseUrl: string): UserDTO {
  const userDTO: UserDTO = {};

  const addBadge = (clientMod: ClientMods, badge: BadgeDTO) => {
    const mod = userDTO[clientMod] ?? { badges: [] };
    mod.badges.push(badge);
    userDTO[clientMod] = mod;
  };

  for (const { clientMod, name } of user?.badges ?? [])
    addBadge(clientMod, { name, image: toBadgeImage(baseUrl, clientMod, name) });

  for (const badge of replugged) addBadge(ClientMods.Replugged, badge);

  return userDTO;
}
