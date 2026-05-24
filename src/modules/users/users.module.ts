import { Module } from "@nestjs/common";
import { RepluggedProvider } from "@providers/replugged/replugged.provider";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [RepluggedProvider, UsersService]
})
export class UsersModule {}
