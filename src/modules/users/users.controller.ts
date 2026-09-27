import { Controller, Get, Param } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from "@nestjs/swagger";
import { BadRequestProblemResponse, NotFoundProblemResponse } from "@problems/response";

import { BadgeDTO } from "./dto/badge.dto";
import { UserDTO } from "./dto/user.dto";
import UserContextDTO from "./dto/user-context.dto";
import { UsersService } from "./users.service";

@Controller("users")
@ApiExtraModels(BadgeDTO)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  @ApiOperation({ summary: "Returns all badges for the given user" })
  @ApiOkResponse({
    description: "Badges keyed by client mod. Only mods where the user has badges are included.",
    schema: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["badges"],
        properties: {
          badges: { type: "array", items: { $ref: getSchemaPath(BadgeDTO) } }
        }
      },
      example: {
        Replugged: {
          badges: [{ name: "Developer", image: "https://replugged.dev/badges/replugged/developer" }]
        }
      }
    }
  })
  @BadRequestProblemResponse()
  @NotFoundProblemResponse()
  public async getUser(@Param() context: UserContextDTO): Promise<UserDTO> {
    return await this.usersService.getUser(context.userId);
  }
}
