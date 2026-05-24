import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppConfigService } from "./appconfig.service";
import { CONFIG_SCHEMA } from "./config.schema";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validate: env => CONFIG_SCHEMA.parse(env)
    })
  ],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class AppConfigModule {}
