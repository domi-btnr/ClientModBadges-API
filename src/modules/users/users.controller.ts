import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { BadRequestProblemResponse, NotFoundProblemResponse } from "@problems/response";

import { UserDTO } from "./dto/user.dto";
import UserContextDTO from "./dto/user-context.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  @ApiOperation({ summary: "Returns all badges for the given user" })
  @ApiOkResponse({ type: UserDTO, isArray: true })
  @BadRequestProblemResponse()
  @NotFoundProblemResponse()
  public async getUser(@Param() context: UserContextDTO): Promise<UserDTO[]> {
    return await this.usersService.getUser(context.userId);
  }
}
