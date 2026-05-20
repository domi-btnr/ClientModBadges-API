import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingModule } from "./logging/logging.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggingModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
