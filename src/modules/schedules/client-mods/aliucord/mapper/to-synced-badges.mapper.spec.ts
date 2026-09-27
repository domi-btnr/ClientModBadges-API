import { toSyncedBadges } from "./to-synced-badges.mapper.js";

describe("Aliucord toSyncedBadges", () => {
  it("should map roles and custom badges", () => {
    const result = toSyncedBadges({
      users: {
        "324622488644616195": {
          roles: ["dev"],
          custom: [
            {
              url: "https://cdn.discordapp.com/emojis/859801776232202280.png?size=48",
              text: "blobcatcozy"
            }
          ]
        },
        "343383572805058560": {
          roles: ["dev", "contributor"]
        }
      }
    });

    expect(result).toEqual([
      { userId: "324622488644616195", name: "dev" },
      {
        userId: "324622488644616195",
        name: "blobcatcozy",
        image: "https://cdn.discordapp.com/emojis/859801776232202280.png?size=48"
      },
      { userId: "343383572805058560", name: "dev" },
      { userId: "343383572805058560", name: "contributor" }
    ]);
  });

  it("should return an empty array for no users", () => {
    expect(toSyncedBadges({ users: {} })).toEqual([]);
  });
});
