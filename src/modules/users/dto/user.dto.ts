import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeDTO } from "./badge.dto.js";

export type UserDTO = Partial<Record<ClientMods, { badges: BadgeDTO[] }>>;
