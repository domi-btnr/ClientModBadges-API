import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { Test, TestingModule } from "@nestjs/testing";

import { getAppUrl } from "../constants";
import { OpenAPIModule } from "./openapi.module";

jest.mock("../constants");

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
    let mockLog: jest.Mock;
    let mockApp: INestApplication;
    let setupSpy: jest.SpyInstance;

    beforeEach(() => {
      mockLog = jest.fn();
      mockApp = {
        get: jest.fn().mockReturnValue({ log: mockLog })
      } as unknown as INestApplication;

      jest.spyOn(SwaggerModule, "createDocument").mockReturnValue({} as never);
      setupSpy = jest.spyOn(SwaggerModule, "setup").mockImplementation(() => undefined);
      (getAppUrl as jest.Mock).mockResolvedValue("http://localhost:8080");
    });

    afterEach(() => jest.restoreAllMocks());

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

    it("should log the docs URL when the callback is called", async () => {
      await OpenAPIModule.init(mockApp)();

      expect(mockLog).toHaveBeenCalledWith(
        "OpenAPI documentation available at http://localhost:8080/docs",
        "OpenAPIModule"
      );
    });
  });
});
