import { Global, INestApplication, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger, LoggerErrorInterceptor, LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>("LOG_LEVEL") ?? "info",
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
