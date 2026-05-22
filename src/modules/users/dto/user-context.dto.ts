import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export default class UserContextDTO {
  @ApiProperty({
    description: "The Discord ID of the user",
    example: "354191516979429376",
    pattern: "^[0-9]{17,20}$",
    required: true,
    externalDocs: {
      description: "How to get a Discord ID",
      url: "https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
    }
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{17,20}$/, {
    message: "userId must be a valid Discord Snowflake ID (17-20 digits long)."
  })
  userId!: string;
}
