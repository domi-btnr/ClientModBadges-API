import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";
import { getAppUrl } from "./constants";
import { LoggingModule } from "./logging/logging.module";
import { OpenAPIModule } from "./openapi/openapi.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  LoggingModule.init(app);
  const logOpenAPIStarted = OpenAPIModule.init(app);

  await app.listen(configService.get("PORT") ?? 8080);
  app.get(Logger).log(`API running at ${await getAppUrl(app)}`, "App");
  await logOpenAPIStarted();
}

void bootstrap();
