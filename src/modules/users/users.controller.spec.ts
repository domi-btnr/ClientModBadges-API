import { Test } from "@nestjs/testing";

import { UserDTO } from "./dto/user.dto.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

describe("UsersController", () => {
  it("should return the badges of the requested user", async () => {
    const user: UserDTO = { Vencord: { badges: [{ name: "Contributor", image: "https://example.com/c.png" }] } };
    const getUser = vi.fn().mockResolvedValue(user);

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: { getUser } }]
    }).compile();

    const result = await module.get(UsersController).getUser({ userId: "354191516979429376" });

    expect(getUser).toHaveBeenCalledWith("354191516979429376");
    expect(result).toBe(user);
  });
});
