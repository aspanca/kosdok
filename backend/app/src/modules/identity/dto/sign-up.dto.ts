import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
  @ApiProperty({ example: "patient@kosdok.local" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Demo Patient" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName: string;

  @ApiProperty({ example: "Password123" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "password must include at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;
}
