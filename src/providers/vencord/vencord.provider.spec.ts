import axios from "axios";
import { PinoLogger } from "nestjs-pino";
import type { MockInstance } from "vitest";

import { VencordProvider } from "./vencord.provider.js";

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
    VenAlt: {
        name: "Vee",
        id: 343383572805058560n
    },
    Domi: {
        name: "Domi",
        id: 354191516979429376n
    }
});
`;

describe("VencordProvider", () => {
  let provider: VencordProvider;
  let get: MockInstance;

  beforeEach(() => {
    get = vi.spyOn(axios, "get");
    const logger = { setContext: vi.fn(), debug: vi.fn() };

    provider = new VencordProvider(logger as unknown as PinoLogger);
  });

  afterEach(() => vi.restoreAllMocks());

  describe("getContributorIds", () => {
    it("should fetch the Vencord constants as text", async () => {
      get.mockResolvedValue({ data: CONSTANTS_SOURCE });

      await provider.getContributorIds();

      expect(get).toHaveBeenCalledWith(
        CONSTANTS_URL,
        expect.objectContaining({ responseType: "text", timeout: 10_000 })
      );
    });

    it("should return unique, valid contributor ids", async () => {
      get.mockResolvedValue({ data: CONSTANTS_SOURCE });

      await expect(provider.getContributorIds()).resolves.toEqual(["343383572805058560", "354191516979429376"]);
    });

    it("should return no ids when no contributors are found", async () => {
      get.mockResolvedValue({ data: "export const Devs = {};" });

      await expect(provider.getContributorIds()).resolves.toEqual([]);
    });

    it("should throw when the request fails", async () => {
      get.mockRejectedValue(new Error("GitHub is down"));

      await expect(provider.getContributorIds()).rejects.toThrow("GitHub is down");
    });
  });

  describe("getDonorBadges", () => {
    it("should fetch the donor badges", async () => {
      const data = {
        "343383572805058560": [
          {
            tooltip: "read if cute",
            badge: "https://badges.vencord.dev/badges/343383572805058560/328425c9155163be836017d59feb92e9a2979381.webp"
          }
        ]
      };
      get.mockResolvedValue({ data });

      await expect(provider.getDonorBadges()).resolves.toEqual(data);
      expect(get).toHaveBeenCalledWith(DONOR_BADGES_URL, expect.objectContaining({ timeout: 10_000 }));
    });

    it("should throw when the request fails", async () => {
      get.mockRejectedValue(new Error("Vencord's Badge API is down"));

      await expect(provider.getDonorBadges()).rejects.toThrow("Vencord's Badge API is down");
    });
  });
});
