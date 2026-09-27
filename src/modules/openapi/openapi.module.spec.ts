import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "nestjs-pino";
import type { Mock, MockInstance } from "vitest";

import { AppConfigService } from "#config";

import { OpenAPIModule } from "./openapi.module.js";

describe("OpenAPIModule", () => {
  describe("module compilation", () => {
    it("should compile", async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [OpenAPIModule]
      }).compile();

      expect(module).toBeDefined();
    });
  });

  describe("init", () => {
    let mockLog: Mock;
    let mockApp: INestApplication;
    let setupSpy: MockInstance;

    beforeEach(() => {
      mockLog = vi.fn();
      mockApp = {
        get: vi.fn((token: unknown) => {
          if (token === AppConfigService) return { get: () => "http://localhost:8080" };
          if (token === Logger) return { log: mockLog };
        })
      } as unknown as INestApplication;

      vi.spyOn(SwaggerModule, "createDocument").mockReturnValue({
        openapi: "3.2.0",
        info: { title: "", version: "" },
        paths: {}
      });
      setupSpy = vi.spyOn(SwaggerModule, "setup").mockImplementation(() => undefined);
    });

    afterEach(() => vi.restoreAllMocks());

    it("should set up Swagger at /docs", () => {
      OpenAPIModule.init(mockApp);

      expect(setupSpy).toHaveBeenCalledWith(
        "docs",
        mockApp,
        expect.anything(),
        expect.objectContaining({
          jsonDocumentUrl: "/docs/openapi.json",
          yamlDocumentUrl: "/docs/openapi.yaml"
        })
      );
    });

    it("should log the docs URL when the callback is called", () => {
      OpenAPIModule.init(mockApp)();

      expect(mockLog).toHaveBeenCalledWith(
        "OpenAPI documentation available at http://localhost:8080/docs",
        "OpenAPIModule"
      );
    });
  });
});
