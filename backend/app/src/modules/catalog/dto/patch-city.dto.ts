import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { CATALOG_RESOURCE_STATUSES } from "../catalog.constants";

export class PatchCityDto {
  @ApiPropertyOptional({ example: "XK" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  countryCode?: string;

  @ApiPropertyOptional({ example: "Prishtine" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: "prishtine" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  normalizedName?: string;

  @ApiPropertyOptional({ example: "10000" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ enum: CATALOG_RESOURCE_STATUSES })
  @IsOptional()
  @IsIn(CATALOG_RESOURCE_STATUSES)
  status?: string;

  @ApiPropertyOptional({ example: "Needs clearer naming" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNote?: string;
}
