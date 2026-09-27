import { INestApplication } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import type { MockInstance } from "vitest";

import { AppConfigService } from "#config";

import { Prisma } from "./generated/client.js";
import { PrismaService } from "./prisma.service.js";

describe("PrismaService", () => {
  let prismaService: PrismaService;
  let logger: { setContext: MockInstance; info: MockInstance; error: MockInstance; logger: { flush: MockInstance } };
  let exitSpy: MockInstance;

  beforeEach(() => {
    const appConfigService = {
      get: vi.fn().mockReturnValue("postgres://admin:password@localhost:5432/clientmodbadges")
    } as unknown as AppConfigService;

    logger = {
      setContext: vi.fn(),
      info: vi.fn(),
      error: vi.fn(),
      logger: { flush: vi.fn((callback: () => void) => callback()) }
    };

    prismaService = new PrismaService(appConfigService, logger as unknown as PinoLogger);
    exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
  });

  afterEach(() => vi.restoreAllMocks());

  it("should set the logger context", () => {
    expect(logger.setContext).toHaveBeenCalledWith("PrismaService");
  });

  describe("onModuleInit", () => {
    it("should connect and verify the connection", async () => {
      const connectSpy = vi.spyOn(prismaService, "$connect").mockResolvedValue();
      const querySpy = vi.spyOn(prismaService, "$queryRaw").mockResolvedValue([] as never);

      await prismaService.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
      expect(querySpy).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith("Connected to the database");
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it("should log a readable message and exit on known connection errors", async () => {
      const error = new Prisma.PrismaClientKnownRequestError("Connection refused", {
        code: "ECONNREFUSED",
        clientVersion: "7.8.0"
      });
      vi.spyOn(prismaService, "$connect").mockRejectedValue(error);

      await prismaService.onModuleInit();

      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("(ECONNREFUSED)"));
      expect(logger.logger.flush).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it("should log the raw error and exit on unknown errors", async () => {
      const error = new Error("Something went wrong");
      vi.spyOn(prismaService, "$connect").mockRejectedValue(error);

      await prismaService.onModuleInit();

      expect(logger.error).toHaveBeenCalledWith(error, "Failed to connect to the database");
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe("onModuleDestroy", () => {
    it("should disconnect from the database", async () => {
      const disconnectSpy = vi.spyOn(prismaService, "$disconnect").mockResolvedValue();

      await prismaService.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith("Disconnected from the database");
    });
  });

  describe("enableShutdownHooks", () => {
    it("should close the app on beforeExit", () => {
      const onSpy = vi.spyOn(process, "on").mockImplementation(() => process);
      const close = vi.fn().mockResolvedValue(undefined);
      const app = { close } as unknown as INestApplication;

      prismaService.enableShutdownHooks(app);

      expect(onSpy).toHaveBeenCalledWith("beforeExit", expect.any(Function));
      const [, handler] = onSpy.mock.calls[0] as [string, () => void];
      handler();
      expect(close).toHaveBeenCalled();
    });
  });
});
