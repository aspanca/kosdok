import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

import {
  CATALOG_RESOURCE_STATUSES,
  CATALOG_SERVICE_TYPES,
  CATALOG_SPECIALTY_STATUSES,
} from "../catalog.constants";

const CATALOG_LIST_STATUSES = [
  ...new Set([...CATALOG_SPECIALTY_STATUSES, ...CATALOG_RESOURCE_STATUSES]),
];

export class ListCatalogQueryDto {
  @ApiPropertyOptional({ example: "cardiology" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  cursor?: string;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ example: "kardi" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @ApiPropertyOptional({ enum: CATALOG_LIST_STATUSES })
  @IsOptional()
  @IsIn(CATALOG_LIST_STATUSES)
  status?: string;
}

export class ListCatalogServicesQueryDto extends ListCatalogQueryDto {
  @ApiPropertyOptional({ example: "spec-cardiology" })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  specialtyId?: string;

  @ApiPropertyOptional({ enum: CATALOG_SERVICE_TYPES })
  @IsOptional()
  @IsIn(CATALOG_SERVICE_TYPES)
  serviceType?: string;
}
