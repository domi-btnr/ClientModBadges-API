import { Module } from "@nestjs/common";

import { AppConfigModule } from "./appconfig/appconfig.module";
import { LoggingModule } from "./logging/logging.module";
import { OpenAPIModule } from "./openapi/openapi.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [AppConfigModule, LoggingModule, OpenAPIModule, PrismaModule, UsersModule]
})
export class AppModule {}
