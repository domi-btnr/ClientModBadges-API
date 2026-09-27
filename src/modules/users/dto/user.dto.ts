import { ClientMods } from "@modules/prisma/generated/enums";

import { BadgeDTO } from "./badge.dto";

export type UserDTO = Partial<Record<ClientMods, { badges: BadgeDTO[] }>>;
