import { RepluggedCustomBadgeDTO } from "./replugged-custom-badge.dto";

export class RepluggedBadgesDTO {
  developer!: boolean;
  staff!: boolean;
  support!: boolean;
  contributor!: boolean;
  translator!: boolean;
  hunter!: boolean;
  early!: boolean;
  booster!: boolean;
  custom!: RepluggedCustomBadgeDTO;
}
