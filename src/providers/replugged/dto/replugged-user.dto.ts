import { RepluggedBadgesDTO } from "./replugged-badges.dto";
import { RepluggedCutiePerksDTO } from "./replugged-cutie-perks.dto";

export class RepluggedUserDTO {
  _id!: string;
  flags!: number;
  username!: string;
  discriminator!: string;
  patronTier!: number;
  cutiePerks!: RepluggedCutiePerksDTO;
  badges!: RepluggedBadgesDTO;
}
