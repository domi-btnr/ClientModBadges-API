import axios from "axios";
import { PinoLogger } from "nestjs-pino";
import type { Mock, MockInstance } from "vitest";

import { ClientMods } from "#modules/prisma/generated/enums.js";

import { BadgeSyncService } from "../../badge-sync.service.js";
import { VencordSchedule } from "./vencord.schedule.js";

const CONSTANTS_URL = "https://raw.githubusercontent.com/Vendicated/Vencord/main/src/utils/constants.ts";
const DONOR_BADGES_URL = "https://badges.vencord.dev/badges.json";

const CONSTANTS_SOURCE = `
export const Devs = /* #__PURE__*/ Object.freeze({
    Anonymous: {
        name: "Anonymous",
        id: 0n
    },
    Ven: {
        name: "Vee",
        id: 343383572805058560n
    },
    Domi: {
        name: "Domi",
        id: 354191516979429376n
    }
});
`;

describe("VencordSchedule", () => {
  let schedule: VencordSchedule;
  let get: MockInstance;
  let replaceBadges: Mock;

  const mockResponses = (responses: { constants?: unknown; donors?: unknown }) =>
    get.mockImplementation((url: string) => {
      const response = url === CONSTANTS_URL ? responses.constants : responses.donors;
      return response instanceof Error ? Promise.reject(response) : Promise.resolve({ data: response });
    });

  beforeEach(() => {
    get = vi.spyOn(axios, "get");
    replaceBadges = vi.fn().mockResolvedValue({ badges: 0, users: 0 });
    const logger = { setContext: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    schedule = new VencordSchedule({ replaceBadges } as unknown as BadgeSyncService, logger as unknown as PinoLogger);
  });

  afterEach(() => vi.restoreAllMocks());

  it("should fetch the contributors and donor badges", async () => {
    mockResponses({
      constants: CONSTANTS_SOURCE,
      donors: {
        "343383572805058560": [
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
          },
          {
            tooltip: "read if cute",
            badge: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
          },
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
          }
        ]
      }
    });

    await schedule.run();

    expect(get).toHaveBeenCalledWith(CONSTANTS_URL, expect.objectContaining({ responseType: "text", timeout: 10_000 }));
    expect(get).toHaveBeenCalledWith(DONOR_BADGES_URL, expect.objectContaining({ timeout: 10_000 }));
  });

  it("should sync unique contributors and donor badges together", async () => {
    mockResponses({
      constants: CONSTANTS_SOURCE,
      donors: {
        "343383572805058560": [
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
          },
          {
            tooltip: "read if cute",
            badge: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
          },
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
          }
        ]
      }
    });

    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Vencord, [
      { userId: "343383572805058560", name: "Contributor" },
      { userId: "354191516979429376", name: "Contributor" },
      {
        userId: "343383572805058560",
        name: undefined,
        image: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
      },
      {
        userId: "343383572805058560",
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      },
      {
        userId: "343383572805058560",
        name: undefined,
        image: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
      }
    ]);
  });

  it("should sync donor badges when no contributors are found", async () => {
    mockResponses({
      constants: "export const Devs = {};",
      donors: {
        "343383572805058560": [
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
          },
          {
            tooltip: "read if cute",
            badge: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
          },
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
          }
        ]
      }
    });

    await schedule.run();

    expect(replaceBadges).toHaveBeenCalledWith(ClientMods.Vencord, [
      {
        userId: "343383572805058560",
        name: undefined,
        image: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
      },
      {
        userId: "343383572805058560",
        name: "read if cute",
        image: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
      },
      {
        userId: "343383572805058560",
        name: undefined,
        image: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
      }
    ]);
  });

  it("should not sync when the contributor request fails", async () => {
    mockResponses({
      constants: new Error("GitHub is down"),
      donors: {
        "343383572805058560": [
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/5761e8a289ef7647b4fed13f1ddfe0ceb763bb34.webp"
          },
          {
            tooltip: "read if cute",
            badge: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
          },
          {
            badge: "https://badges.vencord.dev/badges/343383572805058560/f1b51422045ea3632c4203c9547980fecbecee30.webp"
          }
        ]
      }
    });

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
  });

  it("should not sync when the donor request fails", async () => {
    mockResponses({ constants: CONSTANTS_SOURCE, donors: new Error("Vencord's Badge API is down") });

    await schedule.run();

    expect(replaceBadges).not.toHaveBeenCalled();
  });
});
