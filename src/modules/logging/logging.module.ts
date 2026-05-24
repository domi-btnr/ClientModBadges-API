import { AppConfigService } from "@config";
import { Global, INestApplication, Module } from "@nestjs/common";
import { Logger, LoggerErrorInterceptor, LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => ({
        pinoHttp: {
          level: appConfigService.get("LOG_LEVEL"),
          transport: {
            target: "pino-http-print",
            options: {
              all: true,
              relativeUrl: true,
              translateTime: "SYS:isoUtcDateTime",
              prettyOptions: {
                ignore: "req,context,pid,hostname",
                messageFormat: "[{context}] {msg}"
              }
            }
          }
        }
      })
    })
  ]
})
@Global()
export class LoggingModule {
  static init(app: INestApplication) {
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
  }
}
