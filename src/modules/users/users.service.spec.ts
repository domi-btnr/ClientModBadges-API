import { Test } from "@nestjs/testing";
import type { Mock } from "vitest";

import { AppConfigService } from "#config";
import { ClientMods } from "#modules/prisma/generated/enums.js";
import { PrismaService } from "#modules/prisma/prisma.service.js";
import { RepluggedUserDTO } from "#providers/replugged/dto/replugged-user.dto.js";
import { RepluggedProvider } from "#providers/replugged/replugged.provider.js";

import { USER_WITH_BADGES_INCLUDE } from "./mapper/to-user-dto.mapper.js";
import { UsersService } from "./users.service.js";

const BASE_URL = "http://localhost:8080";
const USER_ID = "354191516979429376";

const REPLUGGED_USER: RepluggedUserDTO = {
  _id: USER_ID,
  flags: 0,
  username: "user",
  discriminator: "0",
  patronTier: 0,
  cutiePerks: { color: null, badge: null, title: null },
  badges: {
    developer: true,
    staff: false,
    support: false,
    contributor: false,
    translator: false,
    hunter: false,
    early: false,
    booster: false,
    custom: { name: null, icon: null, color: null }
  }
};

describe("UsersService", () => {
  let usersService: UsersService;
  let getRepluggedUser: Mock;
  let findUnique: Mock;

  beforeEach(async () => {
    getRepluggedUser = vi.fn();
    findUnique = vi.fn();

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: RepluggedProvider, useValue: { getUser: getRepluggedUser } },
        { provide: PrismaService, useValue: { user: { findUnique } } },
        { provide: AppConfigService, useValue: { get: vi.fn().mockReturnValue(BASE_URL) } }
      ]
    }).compile();

    usersService = module.get(UsersService);
  });

  it("should query the database user with its badges", async () => {
    findUnique.mockResolvedValue(null);

    await usersService.getUser(USER_ID);

    expect(findUnique).toHaveBeenCalledWith({
      where: { id: USER_ID },
      include: USER_WITH_BADGES_INCLUDE,
      omit: { id: true }
    });
  });

  it("should merge database and Replugged badges", async () => {
    getRepluggedUser.mockResolvedValue(REPLUGGED_USER);
    findUnique.mockResolvedValue({ badges: [{ clientMod: ClientMods.Vencord, name: "Contributor", image: null }] });

    await expect(usersService.getUser(USER_ID)).resolves.toEqual({
      Vencord: { badges: [{ name: "Contributor", image: `${BASE_URL}/badges/vencord/contributor` }] },
      Replugged: { badges: [{ name: "Developer", image: `${BASE_URL}/badges/replugged/developer` }] }
    });
  });

  it("should only return database badges when the user has no Replugged account", async () => {
    getRepluggedUser.mockResolvedValue(undefined);
    findUnique.mockResolvedValue({ badges: [{ clientMod: ClientMods.Aliucord, name: "Dev", image: null }] });

    await expect(usersService.getUser(USER_ID)).resolves.toEqual({
      Aliucord: { badges: [{ name: "Dev", image: `${BASE_URL}/badges/aliucord/dev` }] }
    });
  });

  it("should return an empty object when no source has badges", async () => {
    getRepluggedUser.mockResolvedValue(undefined);
    findUnique.mockResolvedValue(null);

    await expect(usersService.getUser(USER_ID)).resolves.toEqual({});
  });

  it("should propagate Replugged errors", async () => {
    const error = new Error("Replugged is down");
    getRepluggedUser.mockRejectedValue(error);

    await expect(usersService.getUser(USER_ID)).rejects.toBe(error);
  });
});
