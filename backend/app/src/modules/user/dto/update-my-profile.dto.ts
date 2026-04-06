import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class UpdateMyProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  locale?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatarUrl?: string;
}
