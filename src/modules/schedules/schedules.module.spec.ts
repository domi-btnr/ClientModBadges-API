import { INestApplication } from "@nestjs/common";
import { CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { Test } from "@nestjs/testing";
import axios from "axios";
import { LoggerModule } from "nestjs-pino";
import type { Mock, MockInstance } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncService } from "./badge-sync.service.js";
import { SchedulesModule } from "./schedules.module.js";

describe("SchedulesModule", () => {
  let app: INestApplication;
  let get: MockInstance;
  let replaceBadges: Mock;

  beforeEach(async () => {
    get = vi.spyOn(axios, "get").mockRejectedValue(new Error("Offline"));
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });

    const module = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({ pinoHttp: { level: "silent" } }), SchedulesModule]
    })
      .overrideProvider(BadgeSyncService)
      .useValue({ replaceBadges })
      .compile();

    app = module.createNestApplication({ logger: false });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    vi.restoreAllMocks();
  });

  it.each(["aliucord-badges", "vencord-badges"])("should schedule %s every hour", name => {
    const schedule = app.get(SchedulerRegistry).getCronJob(name);

    expect(schedule.cronTime.source).toBe(CronExpression.EVERY_HOUR);
  });

  it("should only register crons for the fetched badge sources", () => {
    expect([...app.get(SchedulerRegistry).getCronJobs().keys()].sort()).toEqual(["aliucord-badges", "vencord-badges"]);
  });

  it("should run every schedule once on app start", async () => {
    expect(get).toHaveBeenCalledWith("https://badges.aliucord.com/badges.json", expect.any(Object));
    expect(get).toHaveBeenCalledWith("https://badges.vencord.dev/badges.json", expect.any(Object));
    await vi.waitFor(() => expect(replaceBadges).toHaveBeenCalledWith(ClientMods.BetterDiscord, expect.any(Array)));
  });
});
