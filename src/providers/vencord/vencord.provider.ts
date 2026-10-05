import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

import { REQUEST_CONFIG } from "#providers/request-config.js";
import { VencordDonorBadgesDTO } from "#providers/vencord/dto/vencord-donor-badges.dto.js";

const CONSTANTS_URL = "https://raw.githubusercontent.com/Vendicated/Vencord/main/src/utils/constants.ts";
const DONOR_BADGES_URL = "https://badges.vencord.dev/badges.json";

const CONTRIBUTOR_ID_REGEX = /id: ([0-9]{17,20})n/g;

@Injectable()
export class VencordProvider {
  constructor(private readonly logger: PinoLogger) {
    logger.setContext(VencordProvider.name);
  }

  async getContributorIds(): Promise<string[]> {
    this.logger.debug("Fetching Vencord contributors");
    const { data } = await axios.get<string>(CONSTANTS_URL, { ...REQUEST_CONFIG, responseType: "text" });
    return [...new Set(Array.from(data.matchAll(CONTRIBUTOR_ID_REGEX), ([, id]) => id))];
  }

  async getDonorBadges(): Promise<VencordDonorBadgesDTO> {
    this.logger.debug("Fetching Vencord donor badges");
    const { data } = await axios.get<VencordDonorBadgesDTO>(DONOR_BADGES_URL, REQUEST_CONFIG);
    return data;
  }
}
