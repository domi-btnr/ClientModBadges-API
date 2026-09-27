import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import UserContextDTO from "./user-context.dto.js";

const INVALID_ID_MESSAGE = "userId must be a valid Discord ID (17-20 digits long).";

const validateUserId = async (userId: unknown) => {
  const errors = await validate(plainToInstance(UserContextDTO, { userId }));
  return errors.flatMap(error => Object.values(error.constraints ?? {}));
};

describe("UserContextDTO", () => {
  it.each(["12345678901234567", "12345678901234567890"])("should accept the Discord ID %s", async userId => {
    await expect(validateUserId(userId)).resolves.toEqual([]);
  });

  it.each(["1234567890123456", "123456789012345678901", "abc45678901234567", "12345678901234567 "])(
    "should reject the invalid Discord ID %j",
    async userId => {
      await expect(validateUserId(userId)).resolves.toContain(INVALID_ID_MESSAGE);
    }
  );

  it.each([
    ["an empty", ""],
    ["a missing", undefined]
  ])("should reject %s userId", async (_, userId) => {
    const messages = await validateUserId(userId);

    expect(messages).toContain(INVALID_ID_MESSAGE);
    expect(messages).toContain("userId should not be empty");
  });
});
