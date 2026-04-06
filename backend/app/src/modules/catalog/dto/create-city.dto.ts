import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCityDto {
  @ApiProperty({ example: "xk-prishtine" })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  code: string;

  @ApiProperty({ example: "XK" })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  countryCode: string;

  @ApiProperty({ example: "Prishtine" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: "prishtine" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  normalizedName: string;

  @ApiPropertyOptional({ example: "10000" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;
}
