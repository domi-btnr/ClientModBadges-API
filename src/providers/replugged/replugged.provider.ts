import { Injectable } from "@nestjs/common";
import { RepluggedUserDTO } from "@providers/replugged/dto/replugged-user.dto";
import axios from "axios";
import { PinoLogger } from "nestjs-pino";

const BASE_URL = "https://replugged.dev/api/v1";

@Injectable()
export class RepluggedProvider {
  constructor(private readonly logger: PinoLogger) {
    logger.setContext(RepluggedProvider.name);
  }

  async getUser(userId: string): Promise<RepluggedUserDTO | undefined> {
    this.logger.debug(`Fetching Replugged user ${userId}`);
    try {
      const { data } = await axios.get<RepluggedUserDTO>(`${BASE_URL}/users/${userId}`);

      /**
       * Replugged never returns 404 for missing users. Instead it returns a fake
       * "Herobrine" ghost account (username "Herobrine", discriminator "0001").
       * Treat this response as user-not-found and return undefined.
       */
      if (data.username === "Herobrine" && data.discriminator === "0001") {
        this.logger.debug(`Replugged user ${userId} not found`);
        return;
      }

      return data;
    } catch (error) {
      /**
       * A 404 here is not the same as "user not found" — Replugged handles that
       * via the ghost user above. This 404 would only occur if the userId fails
       * Replugged's route regex (17+ digits), which should never happen given our
       * own validation. Kept as a defensive fallback.
       */
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        this.logger.debug(`Replugged user ${userId} not found`);
        return;
      }

      this.logger.error(error, `Unexpected error fetching Replugged user ${userId}`);
      throw error;
    }
  }
}
