import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ResendVerificationDto {
  @ApiProperty({ example: "patient@kosdok.local" })
  @IsEmail()
  email: string;
}
