import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";

import { LoggingModule } from "./logging.module";

describe("LoggingModule", () => {
  describe("module compilation", () => {
    it("should compile with ConfigModule", async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [ConfigModule.forRoot(), LoggingModule]
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe("init", () => {
    it("should register logger and interceptor on the app", () => {
      const mockLogger = {} as Logger;
      const mockGet = jest.fn().mockReturnValue(mockLogger);
      const mockUseLogger = jest.fn();
      const mockUseGlobalInterceptors = jest.fn();
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
