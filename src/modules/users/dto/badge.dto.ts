import { ApiProperty } from "@nestjs/swagger";

export class BadgeDTO {
  @ApiProperty({
    description: "Display name of the badge",
    example: "Developer",
    required: true
  })
  name!: string;

  @ApiProperty({
    description: "URL of the badge image",
    example: "https://replugged.dev/badges/replugged/developer",
    required: true
  })
  image!: string;

  @ApiProperty({
    description: "Optional hex color associated with the badge",
    example: "#ff0000",
    required: false
  })
  color?: string;
}
