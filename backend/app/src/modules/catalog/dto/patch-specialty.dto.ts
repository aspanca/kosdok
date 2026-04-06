import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { CATALOG_SPECIALTY_STATUSES } from "../catalog.constants";

export class PatchSpecialtyDto {
  @ApiPropertyOptional({ example: "cardiology" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  code?: string;

  @ApiPropertyOptional({ example: "Cardiology" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional({ enum: CATALOG_SPECIALTY_STATUSES })
  @IsOptional()
  @IsIn(CATALOG_SPECIALTY_STATUSES)
  status?: string;
}
