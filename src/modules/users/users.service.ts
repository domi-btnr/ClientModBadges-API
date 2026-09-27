import { AppConfigService } from "@config";
import { PrismaService } from "@modules/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { toBadges } from "@providers/replugged/mapper/to-badges.mapper";
import { RepluggedProvider } from "@providers/replugged/replugged.provider";

import { UserDTO } from "./dto/user.dto";
import { toUserDTO, USER_WITH_BADGES_INCLUDE } from "./mapper/to-user-dto.mapper";

@Injectable()
export class UsersService {
  constructor(
    private readonly repluggedProvider: RepluggedProvider,
    private readonly prismaService: PrismaService,
    private readonly appConfigService: AppConfigService
  ) {}

  public async getUser(userId: string): Promise<UserDTO> {
    const baseUrl = this.appConfigService.get("BASE_URL");

    const repluggedUser = await this.repluggedProvider.getUser(userId);
    const replugged = repluggedUser ? toBadges(repluggedUser, baseUrl) : [];

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: USER_WITH_BADGES_INCLUDE,
      omit: { id: true }
    });

    return toUserDTO({ user, replugged }, baseUrl);
  }
}
