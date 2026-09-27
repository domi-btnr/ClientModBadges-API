import { PrismaService } from "@modules/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { RepluggedProvider } from "@providers/replugged/replugged.provider";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [RepluggedProvider, PrismaService, UsersService]
})
export class UsersModule {}
