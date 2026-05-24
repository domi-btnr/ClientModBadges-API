import { AppConfigService } from "@config";
import { Injectable } from "@nestjs/common";
import { toBadges } from "@providers/replugged/mapper/to-badges.mapper";
import { RepluggedProvider } from "@providers/replugged/replugged.provider";

@Injectable()
export class UsersService {
  constructor(
    private readonly repluggedProvider: RepluggedProvider,
    private readonly appConfigService: AppConfigService
  ) {}

  public async getUser(userId: string) {
    const repluggedUser = await this.repluggedProvider.getUser(userId);
    if (!repluggedUser) {
      return [];
    }
    return toBadges(repluggedUser, this.appConfigService.get("BASE_URL"));
  }
}
