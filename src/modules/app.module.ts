import { Module } from "@nestjs/common";
import { ConditionalModule } from "@nestjs/config";

import { AppConfigModule } from "./appconfig/appconfig.module.js";
import { CONFIG_SCHEMA } from "./appconfig/config.schema.js";
import { LoggingModule } from "./logging/logging.module.js";
import { OpenAPIModule } from "./openapi/openapi.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { SchedulesModule } from "./schedules/schedules.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [
    AppConfigModule,
    LoggingModule,
    OpenAPIModule,
    PrismaModule,
    ConditionalModule.registerWhen(SchedulesModule, env => CONFIG_SCHEMA.parse(env).BADGE_SYNC_ENABLED),
    UsersModule
  ]
})
export class AppModule {}
