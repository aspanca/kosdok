import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class VerifyEmailDto {
  @ApiProperty({ example: "2d0609d4a8f31a..." })
  @IsString()
  @MinLength(20)
  token: string;
}
