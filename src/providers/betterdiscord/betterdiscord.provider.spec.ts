import { BetterDiscordProvider } from "./betterdiscord.provider.js";

describe("BetterDiscordProvider", () => {
  it("should return the BetterDiscord developer ids", async () => {
    await expect(new BetterDiscordProvider().getDeveloperIds()).resolves.toEqual([
      "249746236008169473",
      "515780151791976453",
      "917630027477159986",
      "619261917352951815"
    ]);
  });
});
