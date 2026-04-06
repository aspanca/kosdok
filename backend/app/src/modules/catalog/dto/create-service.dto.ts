import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

import { CATALOG_SERVICE_TYPES } from "../catalog.constants";

export class CreateServiceDto {
  @ApiProperty({ example: "cardiology_consultation" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  code: string;

  @ApiProperty({ example: "Cardiology Consultation" })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name: string;

  @ApiProperty({ enum: CATALOG_SERVICE_TYPES })
  @IsIn(CATALOG_SERVICE_TYPES)
  serviceType: string;

  @ApiPropertyOptional({ example: "spec-cardiology" })
  @IsOptional()
  @IsString()
  @MaxLength(36)
  specialtyId?: string;
}
