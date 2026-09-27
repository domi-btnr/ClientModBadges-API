import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";

import { AppConfigModule } from "#modules/appconfig/appconfig.module.js";

import { LoggingModule } from "./logging.module.js";

describe("LoggingModule", () => {
  describe("module compilation", () => {
    it("should compile with AppConfigModule", async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppConfigModule, LoggingModule]
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe("init", () => {
    it("should register logger and interceptor on the app", () => {
      const mockLogger = {} as Logger;
      const mockGet = vi.fn().mockReturnValue(mockLogger);
      const mockUseLogger = vi.fn();
      const mockUseGlobalInterceptors = vi.fn();
      const mockApp = {
        get: mockGet,
        useLogger: mockUseLogger,
        useGlobalInterceptors: mockUseGlobalInterceptors
      } as unknown as INestApplication;

      LoggingModule.init(mockApp);

      expect(mockGet).toHaveBeenCalledWith(Logger);
      expect(mockUseLogger).toHaveBeenCalledWith(mockLogger);
      expect(mockUseGlobalInterceptors).toHaveBeenCalledWith(expect.any(LoggerErrorInterceptor));
    });
  });
});
