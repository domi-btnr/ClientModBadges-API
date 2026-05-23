import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { BadRequestProblemResponse, NotFoundProblemResponse } from "@problems/response";

import UserContextDTO from "./dto/user-context.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":userId")
  @ApiOperation({ summary: "Returns all badges for the given user" })
  @BadRequestProblemResponse()
  @NotFoundProblemResponse()
  public getUser(@Param() context: UserContextDTO) {
    return null;
  }
}
