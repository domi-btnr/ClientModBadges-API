import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggingModule } from "./logging/logging.module";
import { OpenAPIModule } from "./openapi/openapi.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggingModule, OpenAPIModule, UsersModule]
})
export class AppModule {}
