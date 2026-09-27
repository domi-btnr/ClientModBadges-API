import { RepluggedBadgesDTO } from "./replugged-badges.dto.js";
import { RepluggedCutiePerksDTO } from "./replugged-cutie-perks.dto.js";

export class RepluggedUserDTO {
  _id!: string;
  flags!: number;
  username!: string;
  discriminator!: string;
  patronTier!: number;
  cutiePerks!: RepluggedCutiePerksDTO;
  badges!: RepluggedBadgesDTO;
}
