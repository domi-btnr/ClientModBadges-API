import { INestApplication } from "@nestjs/common";

import { PrismaModule } from "./prisma.module.js";
import { PrismaService } from "./prisma.service.js";

describe("PrismaModule", () => {
  describe("init", () => {
    it("should enable the shutdown hooks of the PrismaService", () => {
      const prismaService = { enableShutdownHooks: vi.fn() };
      const mockGet = vi.fn().mockReturnValue(prismaService);
      const app = { get: mockGet } as unknown as INestApplication;

      PrismaModule.init(app);

      expect(mockGet).toHaveBeenCalledWith(PrismaService);
      expect(prismaService.enableShutdownHooks).toHaveBeenCalledWith(app);
    });
  });
});
