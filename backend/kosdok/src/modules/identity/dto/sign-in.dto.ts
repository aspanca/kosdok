import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInDto {
  @ApiProperty({ example: "patient@kosdok.local" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Password123" })
  @IsString()
  @MinLength(8)
  password: string;
}
