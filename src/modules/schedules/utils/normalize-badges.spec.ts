import { normalizeBadges } from "./normalize-badges.js";

const USER_ID = "354191516979429376";

describe("normalizeBadges", () => {
  it("should drop badges with invalid user IDs or nothing to display", () => {
    const result = normalizeBadges([
      { userId: "0", name: "Contributor" },
      { userId: "abc", name: "Contributor" },
      { userId: USER_ID, name: "" },
      { userId: USER_ID, name: "   ", image: " " },
      { userId: USER_ID, name: "Contributor" }
    ]);

    expect(result).toEqual([{ userId: USER_ID, name: "Contributor", image: undefined }]);
  });

  it("should keep nameless badges that have an image", () => {
    const result = normalizeBadges([
      { userId: USER_ID, image: "https://a.png" },
      { userId: USER_ID, image: "https://b.png" }
    ]);

    expect(result).toEqual([
      { userId: USER_ID, name: undefined, image: "https://a.png" },
      { userId: USER_ID, name: undefined, image: "https://b.png" }
    ]);
  });

  it("should allow the same name with different images", () => {
    const result = normalizeBadges([
      { userId: USER_ID, name: "Donor", image: "https://a.png" },
      { userId: USER_ID, name: "Donor", image: "https://b.png" }
    ]);

    expect(result).toHaveLength(2);
  });

  it("should remove exact duplicates", () => {
    const result = normalizeBadges([
      { userId: USER_ID, name: "Contributor" },
      { userId: USER_ID, name: "Contributor" },
      { userId: USER_ID, name: "Donor", image: "https://a.png" },
      { userId: USER_ID, name: "Donor", image: "https://a.png" }
    ]);

    expect(result).toEqual([
      { userId: USER_ID, name: "Contributor", image: undefined },
      { userId: USER_ID, name: "Donor", image: "https://a.png" }
    ]);
  });

  it("should trim values and treat empty strings as missing", () => {
    expect(normalizeBadges([{ userId: ` ${USER_ID} `, name: " Dev ", image: " " }])).toEqual([
      { userId: USER_ID, name: "Dev", image: undefined }
    ]);
  });
});
