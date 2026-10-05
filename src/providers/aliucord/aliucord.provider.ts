import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

import { AliucordBadgesDTO } from "#providers/aliucord/dto/aliucord-badges.dto.js";
import { REQUEST_CONFIG } from "#providers/request-config.js";

const BADGES_URL = "https://badges.aliucord.com/badges.json";

@Injectable()
export class AliucordProvider {
  constructor(private readonly logger: PinoLogger) {
    logger.setContext(AliucordProvider.name);
  }

  async getBadges(): Promise<AliucordBadgesDTO> {
    this.logger.debug("Fetching Aliucord badges");
    const { data } = await axios.get<AliucordBadgesDTO>(BADGES_URL, REQUEST_CONFIG);
    return data;
  }
}
