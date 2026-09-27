import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { AppConfigService } from "#config";
import { AppModule } from "#modules/app.module.js";
import { LoggingModule } from "#modules/logging/logging.module.js";
import { OpenAPIModule } from "#modules/openapi/openapi.module.js";
import { PrismaModule } from "#modules/prisma/prisma.module.js";

import { ProblemDetailsException } from "./problems/exception/index.js";
import { ProblemDetailsFilter } from "./problems/filter/index.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalFilters(new ProblemDetailsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => {
        const errorDetails = errors.flatMap(e => Object.values(e.constraints ?? {})).map(detail => ({ detail }));

        return new ProblemDetailsException(
          {
            type: "error:api@clientmodbadges:validation-failed",
            status: 400,
            title: "Validation failed",
            errors: errorDetails
          },
          400
        );
      }
    })
  );

  LoggingModule.init(app);
  PrismaModule.init(app);
  const logOpenAPIStarted = OpenAPIModule.init(app);

  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.get("PORT"));
  app.get(Logger).log(`API running at ${appConfigService.get("BASE_URL")}`, "App");
  logOpenAPIStarted();
}

void bootstrap();
