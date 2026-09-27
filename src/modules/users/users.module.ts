import { Module } from "@nestjs/common";

import { PrismaService } from "#modules/prisma/prisma.service.js";
import { RepluggedProvider } from "#providers/replugged/replugged.provider.js";

import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

@Module({
  controllers: [UsersController],
  providers: [RepluggedProvider, PrismaService, UsersService]
})
export class UsersModule {}
