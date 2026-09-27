import { toSyncedBadges } from "./to-synced-badges.mapper.js";

describe("Vencord toSyncedBadges", () => {
  it("should map contributors and donor badges", () => {
    const result = toSyncedBadges(["343383572805058560", "354191516979429376"], {
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
    });

    expect(result).toEqual([
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
});
