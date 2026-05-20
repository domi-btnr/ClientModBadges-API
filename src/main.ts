import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";
import { LoggingModule } from "./logging/logging.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  LoggingModule.init(app);

  await app.listen(configService.get("PORT") ?? 8080);

  const API_URL = (await app.getUrl()).replace("[::1]", "localhost");
  app.get(Logger).log(`API running at ${API_URL}`, "App");
}

void bootstrap();
