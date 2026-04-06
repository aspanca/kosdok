import { plainToInstance, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min, validateSync } from "class-validator";

enum NodeEnvironment {
  Development = "development",
  Production = "production",
  Test = "test",
}

class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  @IsOptional()
  NODE_ENV: NodeEnvironment = NodeEnvironment.Development;

  @Transform(({ value }) => Number.parseInt(String(value), 10))
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000;

  @IsString()
  JWT_ACCESS_SECRET = "change-this-in-production";

  @IsString()
  JWT_REFRESH_SECRET = "change-this-refresh-secret-in-production";

  @IsString()
  @IsOptional()
  DB_HOST = "127.0.0.1";

  @Transform(({ value }) => Number.parseInt(String(value), 10))
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  DB_PORT = 3306;

  @IsString()
  @IsOptional()
  DB_USER = "kosdok";

  @IsString()
  @IsOptional()
  DB_PASSWORD = "kosdok";

  @IsString()
  @IsOptional()
  DB_NAME = "kosdok";

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES_IN = "15m";

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN = "7d";

  @IsString()
  @IsOptional()
  APP_PUBLIC_URL = "http://localhost:3000";

  @IsString()
  @IsOptional()
  MAIL_TRANSPORT = "console";

  @IsString()
  @IsOptional()
  MAIL_FROM = "no-reply@kosdok.local";

  @IsString()
  @IsOptional()
  MAIL_HOST = "";

  @Transform(({ value }) => Number.parseInt(String(value), 10))
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  MAIL_PORT = 587;

  @IsString()
  @IsOptional()
  MAIL_USER = "";

  @IsString()
  @IsOptional()
  MAIL_PASSWORD = "";

  @Transform(({ value }) => {
    if (typeof value === "boolean") {
      return value;
    }

    const normalized = String(value).trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  })
  @IsBoolean()
  @IsOptional()
  MAIL_SECURE = false;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  return validatedConfig;
}
