import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppConfigService } from "./appconfig.service.js";
import { CONFIG_SCHEMA } from "./config.schema.js";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      validate: env => CONFIG_SCHEMA.parse(env)
    })
  ],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
