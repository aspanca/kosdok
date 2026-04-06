import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "patient@kosdok.local" })
  @IsEmail()
  email: string;
}
