import { Global, INestApplication, Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service.js";

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {
  static init(app: INestApplication) {
    const prismaService = app.get(PrismaService);
    prismaService.enableShutdownHooks(app);
  }
}
