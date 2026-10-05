import axios from "axios";
import { PinoLogger } from "nestjs-pino";
import type { MockInstance } from "vitest";

import { AliucordProvider } from "./aliucord.provider.js";

describe("AliucordProvider", () => {
  let provider: AliucordProvider;
  let get: MockInstance;

  beforeEach(() => {
    get = vi.spyOn(axios, "get");
    const logger = { setContext: vi.fn(), debug: vi.fn() };

    provider = new AliucordProvider(logger as unknown as PinoLogger);
  });

  afterEach(() => vi.restoreAllMocks());

  it("should fetch the Aliucord badge data", async () => {
    const data = { users: { "343383572805058560": { roles: ["dev"] } } };
    get.mockResolvedValue({ data });

    await expect(provider.getBadges()).resolves.toEqual(data);
    expect(get).toHaveBeenCalledWith("https://badges.aliucord.com/badges.json", {
      headers: { "Cache-Control": "no-cache" },
      timeout: 10_000
    });
  });

  it("should throw when the Aliucord request fails", async () => {
    get.mockRejectedValue(new Error("Network error"));

    await expect(provider.getBadges()).rejects.toThrow("Network error");
  });
});
