import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { CATALOG_RESOURCE_STATUSES, CATALOG_SERVICE_TYPES } from "../catalog.constants";

export class PatchServiceDto {
  @ApiPropertyOptional({ example: "cardiology_consultation" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  code?: string;

  @ApiPropertyOptional({ example: "Cardiology Consultation" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional({ enum: CATALOG_SERVICE_TYPES })
  @IsOptional()
  @IsIn(CATALOG_SERVICE_TYPES)
  serviceType?: string;

  @ApiPropertyOptional({ example: "spec-cardiology" })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  specialtyId?: string;

  @ApiPropertyOptional({ enum: CATALOG_RESOURCE_STATUSES })
  @IsOptional()
  @IsIn(CATALOG_RESOURCE_STATUSES)
  status?: string;

  @ApiPropertyOptional({ example: "Approved after review" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewNote?: string;
}
