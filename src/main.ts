import { AppModule } from "@modules/app.module";
import { LoggingModule } from "@modules/logging/logging.module";
import { OpenAPIModule } from "@modules/openapi/openapi.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { getAppUrl } from "@utils";
import { Logger } from "nestjs-pino";

import { ProblemDetailsException } from "./problems/exception";
import { ProblemDetailsFilter } from "./problems/filter";

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
  const logOpenAPIStarted = OpenAPIModule.init(app);

  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT") ?? 8080);
  app.get(Logger).log(`API running at ${await getAppUrl(app)}`, "App");
  await logOpenAPIStarted();
}

void bootstrap();
