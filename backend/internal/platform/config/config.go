package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"sync"

	"github.com/joho/godotenv"
)

const (
	defaultJWTSecret   = "dev-change-me"
	defaultJWTIssuer   = "kosdok-api"
	defaultJWTAudience = "kosdok-clients"
	defaultEnv         = "development"
)

var envFilesLoadOnce sync.Once

type Config struct {
	Port                             string
	Env                              string
	DBPath                           string
	JWTSecret                        string
	JWTIssuer                        string
	JWTAudience                      string
	JWTLeewaySeconds                 int
	TrustedOrigins                   []string
	AuthLoginRateLimitPerMinute      int
	AuthRegisterRateLimitPerMinute   int
	SQLiteJournalMode                string
	SQLiteSynchronous                string
	SQLiteBusyTimeoutMS              int
	SQLiteForeignKeysOn              bool
	RefreshTokenRevokedRetentionDays int
}

func Load() Config {
	loadEnvFiles()

	return Config{
		Port:                             getEnv("PORT", "8080"),
		Env:                              getEnv("ENV", defaultEnv),
		DBPath:                           getEnv("DB_PATH", "./data/app.db"),
		JWTSecret:                        getEnv("JWT_SECRET", defaultJWTSecret),
		JWTIssuer:                        getEnv("JWT_ISSUER", defaultJWTIssuer),
		JWTAudience:                      getEnv("JWT_AUDIENCE", defaultJWTAudience),
		JWTLeewaySeconds:                 getEnvInt("JWT_LEEWAY_SECONDS", 5),
		TrustedOrigins:                   getEnvCSV("TRUSTED_ORIGINS"),
		AuthLoginRateLimitPerMinute:      getEnvInt("AUTH_LOGIN_RATE_LIMIT_PER_MIN", 10),
		AuthRegisterRateLimitPerMinute:   getEnvInt("AUTH_REGISTER_RATE_LIMIT_PER_MIN", 5),
		SQLiteJournalMode:                getEnv("SQLITE_JOURNAL_MODE", "WAL"),
		SQLiteSynchronous:                getEnv("SQLITE_SYNCHRONOUS", "NORMAL"),
		SQLiteBusyTimeoutMS:              getEnvInt("SQLITE_BUSY_TIMEOUT_MS", 5000),
		SQLiteForeignKeysOn:              getEnvBool("SQLITE_FOREIGN_KEYS", true),
		RefreshTokenRevokedRetentionDays: getEnvInt("REFRESH_TOKEN_REVOKED_RETENTION_DAYS", 30),
	}
}

func loadEnvFiles() {
	envFilesLoadOnce.Do(func() {
		env := resolveEnvForDotenv()

		loadEnvFileIfExists(".env." + env)
		loadEnvFileIfExists(".env")
	})
}

func resolveEnvForDotenv() string {
	env := strings.TrimSpace(os.Getenv("ENV"))
	if env != "" {
		return env
	}

	values, err := godotenv.Read(".env")
	if err == nil {
		env = strings.TrimSpace(values["ENV"])
	}
	if env == "" {
		env = defaultEnv
	}

	return env
}

func loadEnvFileIfExists(path string) {
	if _, err := os.Stat(path); err != nil {
		return
	}

	_ = godotenv.Load(path)
}

func (c Config) Address() string {
	return ":" + c.Port
}

func (c Config) ValidateForAPI() error {
	if strings.TrimSpace(c.JWTSecret) == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}

	if strings.TrimSpace(c.JWTIssuer) == "" {
		return fmt.Errorf("JWT_ISSUER is required")
	}

	if strings.TrimSpace(c.JWTAudience) == "" {
		return fmt.Errorf("JWT_AUDIENCE is required")
	}

	if c.JWTLeewaySeconds < 0 {
		return fmt.Errorf("JWT_LEEWAY_SECONDS must be >= 0")
	}

	if c.AuthLoginRateLimitPerMinute <= 0 {
		return fmt.Errorf("AUTH_LOGIN_RATE_LIMIT_PER_MIN must be > 0")
	}

	if c.AuthRegisterRateLimitPerMinute <= 0 {
		return fmt.Errorf("AUTH_REGISTER_RATE_LIMIT_PER_MIN must be > 0")
	}

	if c.RefreshTokenRevokedRetentionDays < 0 {
		return fmt.Errorf("REFRESH_TOKEN_REVOKED_RETENTION_DAYS must be >= 0")
	}

	if strings.EqualFold(c.Env, "production") {
		if c.JWTSecret == defaultJWTSecret || len(c.JWTSecret) < 32 {
			return fmt.Errorf("in production JWT_SECRET must not use default and must be at least 32 chars")
		}
	}

	return nil
}

func getEnv(key string, fallback string) string {
	v, ok := os.LookupEnv(key)
	if !ok || v == "" {
		return fallback
	}
	return v
}

func getEnvInt(key string, fallback int) int {
	v, ok := os.LookupEnv(key)
	if !ok || v == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(v)
	if err != nil {
		return fallback
	}

	return parsed
}

func getEnvBool(key string, fallback bool) bool {
	v, ok := os.LookupEnv(key)
	if !ok || v == "" {
		return fallback
	}

	parsed, err := strconv.ParseBool(v)
	if err != nil {
		return fallback
	}

	return parsed
}

func getEnvCSV(key string) []string {
	v, ok := os.LookupEnv(key)
	if !ok || strings.TrimSpace(v) == "" {
		return nil
	}

	parts := strings.Split(v, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			out = append(out, part)
		}
	}

	if len(out) == 0 {
		return nil
	}

	return out
}
