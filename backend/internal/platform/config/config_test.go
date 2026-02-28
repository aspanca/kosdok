package config

import "testing"

func TestAddress(t *testing.T) {
	cfg := Config{Port: "9999"}
	if got := cfg.Address(); got != ":9999" {
		t.Fatalf("Address() = %s, want %s", got, ":9999")
	}
}

func TestLoadDefaults(t *testing.T) {
	t.Setenv("PORT", "")
	t.Setenv("ENV", "")
	t.Setenv("DB_PATH", "")
	t.Setenv("JWT_SECRET", "")
	t.Setenv("JWT_ISSUER", "")
	t.Setenv("JWT_AUDIENCE", "")
	t.Setenv("JWT_LEEWAY_SECONDS", "")
	t.Setenv("TRUSTED_ORIGINS", "")
	t.Setenv("AUTH_LOGIN_RATE_LIMIT_PER_MIN", "")
	t.Setenv("AUTH_REGISTER_RATE_LIMIT_PER_MIN", "")
	t.Setenv("SQLITE_JOURNAL_MODE", "")
	t.Setenv("SQLITE_SYNCHRONOUS", "")
	t.Setenv("SQLITE_BUSY_TIMEOUT_MS", "")
	t.Setenv("SQLITE_FOREIGN_KEYS", "")
	t.Setenv("REFRESH_TOKEN_REVOKED_RETENTION_DAYS", "")

	cfg := Load()

	if cfg.JWTIssuer != defaultJWTIssuer {
		t.Fatalf("JWTIssuer = %q, want %q", cfg.JWTIssuer, defaultJWTIssuer)
	}
	if cfg.JWTAudience != defaultJWTAudience {
		t.Fatalf("JWTAudience = %q, want %q", cfg.JWTAudience, defaultJWTAudience)
	}
	if cfg.JWTLeewaySeconds != 5 {
		t.Fatalf("JWTLeewaySeconds = %d, want %d", cfg.JWTLeewaySeconds, 5)
	}
	if cfg.AuthLoginRateLimitPerMinute != 10 {
		t.Fatalf("AuthLoginRateLimitPerMinute = %d, want %d", cfg.AuthLoginRateLimitPerMinute, 10)
	}
	if cfg.AuthRegisterRateLimitPerMinute != 5 {
		t.Fatalf("AuthRegisterRateLimitPerMinute = %d, want %d", cfg.AuthRegisterRateLimitPerMinute, 5)
	}
	if cfg.RefreshTokenRevokedRetentionDays != 30 {
		t.Fatalf("RefreshTokenRevokedRetentionDays = %d, want %d", cfg.RefreshTokenRevokedRetentionDays, 30)
	}
}

func TestLoadFromEnv(t *testing.T) {
	t.Setenv("JWT_ISSUER", "issuer-x")
	t.Setenv("JWT_AUDIENCE", "aud-x")
	t.Setenv("JWT_LEEWAY_SECONDS", "12")
	t.Setenv("TRUSTED_ORIGINS", "https://app.example.com, https://admin.example.com")
	t.Setenv("AUTH_LOGIN_RATE_LIMIT_PER_MIN", "20")
	t.Setenv("AUTH_REGISTER_RATE_LIMIT_PER_MIN", "7")
	t.Setenv("REFRESH_TOKEN_REVOKED_RETENTION_DAYS", "60")

	cfg := Load()

	if cfg.JWTIssuer != "issuer-x" {
		t.Fatalf("JWTIssuer = %q, want %q", cfg.JWTIssuer, "issuer-x")
	}
	if cfg.JWTAudience != "aud-x" {
		t.Fatalf("JWTAudience = %q, want %q", cfg.JWTAudience, "aud-x")
	}
	if cfg.JWTLeewaySeconds != 12 {
		t.Fatalf("JWTLeewaySeconds = %d, want %d", cfg.JWTLeewaySeconds, 12)
	}
	if len(cfg.TrustedOrigins) != 2 {
		t.Fatalf("TrustedOrigins len = %d, want %d", len(cfg.TrustedOrigins), 2)
	}
	if cfg.AuthLoginRateLimitPerMinute != 20 {
		t.Fatalf("AuthLoginRateLimitPerMinute = %d, want %d", cfg.AuthLoginRateLimitPerMinute, 20)
	}
	if cfg.AuthRegisterRateLimitPerMinute != 7 {
		t.Fatalf("AuthRegisterRateLimitPerMinute = %d, want %d", cfg.AuthRegisterRateLimitPerMinute, 7)
	}
	if cfg.RefreshTokenRevokedRetentionDays != 60 {
		t.Fatalf("RefreshTokenRevokedRetentionDays = %d, want %d", cfg.RefreshTokenRevokedRetentionDays, 60)
	}
}

func TestValidateForAPIRejectsWeakProductionSecret(t *testing.T) {
	cfg := Config{
		Env:                            "production",
		JWTSecret:                      "dev-change-me",
		JWTIssuer:                      "issuer",
		JWTAudience:                    "aud",
		JWTLeewaySeconds:               5,
		AuthLoginRateLimitPerMinute:    10,
		AuthRegisterRateLimitPerMinute: 5,
	}

	err := cfg.ValidateForAPI()
	if err == nil {
		t.Fatal("expected validation error for weak production secret")
	}
}
