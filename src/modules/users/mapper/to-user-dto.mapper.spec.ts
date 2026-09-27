import { ClientMods } from "#modules/prisma/generated/enums.js";

import { toUserDTO } from "./to-user-dto.mapper.js";

const BASE_URL = "http://localhost:8080";

describe("toUserDTO", () => {
  it("should return an empty object without any badges", () => {
    expect(toUserDTO({ user: null, replugged: [] }, BASE_URL)).toEqual({});
  });

  it("should group database badges by client mod and build image URLs", () => {
    const result = toUserDTO(
      {
        user: {
          badges: [
            { clientMod: ClientMods.Vencord, name: "Contributor", image: null },
            { clientMod: ClientMods.Aliucord, name: "Bug Hunter", image: null },
            { clientMod: ClientMods.Vencord, name: "Donor", image: null }
          ]
        },
        replugged: []
      },
      BASE_URL
    );

    expect(result).toEqual({
      Vencord: {
        badges: [
          { name: "Contributor", image: `${BASE_URL}/badges/vencord/contributor` },
          { name: "Donor", image: `${BASE_URL}/badges/vencord/donor` }
        ]
      },
      Aliucord: {
        badges: [{ name: "Bug Hunter", image: `${BASE_URL}/badges/aliucord/bug_hunter` }]
      }
    });
  });

  it("should use the stored image for custom badges", () => {
    const result = toUserDTO(
      {
        user: { badges: [{ clientMod: ClientMods.Vencord, name: "Donor", image: "https://example.com/donor.png" }] },
        replugged: []
      },
      BASE_URL
    );

    expect(result).toEqual({
      Vencord: { badges: [{ name: "Donor", image: "https://example.com/donor.png" }] }
    });
  });

  it("should return custom badges without a name", () => {
    const result = toUserDTO(
      {
        user: { badges: [{ clientMod: ClientMods.Vencord, name: null, image: "https://example.com/badge.png" }] },
        replugged: []
      },
      BASE_URL
    );

    expect(result).toEqual({ Vencord: { badges: [{ name: undefined, image: "https://example.com/badge.png" }] } });
  });

  it("should skip badges without a name and an image", () => {
    const result = toUserDTO(
      { user: { badges: [{ clientMod: ClientMods.Vencord, name: null, image: null }] }, replugged: [] },
      BASE_URL
    );

    expect(result).toEqual({});
  });

  it("should append Replugged badges after database Replugged badges", () => {
    const repluggedBadge = { name: "Developer", image: `${BASE_URL}/badges/replugged/developer` };

    const result = toUserDTO(
      {
        user: { badges: [{ clientMod: ClientMods.Replugged, name: "Early Supporter", image: null }] },
        replugged: [repluggedBadge]
      },
      BASE_URL
    );

    expect(result).toEqual({
      Replugged: {
        badges: [{ name: "Early Supporter", image: `${BASE_URL}/badges/replugged/early_supporter` }, repluggedBadge]
      }
    });
  });

  it("should include Replugged badges for users without database badges", () => {
    const repluggedBadge = { name: "Booster", image: `${BASE_URL}/badges/replugged/booster` };

    expect(toUserDTO({ user: null, replugged: [repluggedBadge] }, BASE_URL)).toEqual({
      Replugged: { badges: [repluggedBadge] }
    });
  });
});
