import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateSpecialtyDto {
  @ApiProperty({ example: "cardiology" })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code: string;

  @ApiProperty({ example: "Cardiology" })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;
}
