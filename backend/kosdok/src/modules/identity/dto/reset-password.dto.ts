import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ example: "2d0609d4a8f31a..." })
  @IsString()
  @MinLength(20)
  token: string;

  @ApiProperty({ example: "NewPassword123" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "newPassword must include at least one uppercase letter, one lowercase letter, and one number",
  })
  newPassword: string;

  @ApiProperty({ example: "NewPassword123" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  confirmPassword: string;
}
