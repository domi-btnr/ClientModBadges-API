import { AppConfigService } from "@config";
import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PinoLogger } from "nestjs-pino";
import { Pool } from "pg";

import { Prisma, PrismaClient } from "./generated/client";

const CONNECTION_ERROR_MESSAGES: Record<string, string> = {
  ECONNREFUSED: "Could not reach the database server — nothing is listening on the configured host and port",
  ENOTFOUND: "Could not resolve the database host — check the configured host",
  ETIMEDOUT: "Database connection timed out",
  ECONNRESET: "Database connection was reset",
  "28P01": "Database authentication failed — check the configured credentials",
  "28000": "Database access denied for the configured user",
  "3D000": "Configured database does not exist"
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger: PinoLogger;

  constructor(appConfigService: AppConfigService, logger: PinoLogger) {
    const pool = new Pool({ connectionString: appConfigService.get("DATABASE_URL") });
    super({ adapter: new PrismaPg(pool) });

    this.logger = logger;
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
      this.logger.info("Connected to the database");
    } catch (error) {
      const knownMessage =
        error instanceof Prisma.PrismaClientKnownRequestError && CONNECTION_ERROR_MESSAGES[error.code];
      if (knownMessage) {
        this.logger.error(`${knownMessage} (${error.code})`);
      } else {
        this.logger.error(error, "Failed to connect to the database");
      }
      await new Promise<void>(resolve => this.logger.logger.flush(() => resolve()));
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.info("Disconnected from the database");
  }

  enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", () => {
      void app.close();
    });
  }
}
