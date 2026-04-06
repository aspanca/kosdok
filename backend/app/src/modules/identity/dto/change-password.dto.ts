import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "CurrentPassword123" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  currentPassword: string;

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
