package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port                string
	Env                 string
	DBPath              string
	JWTSecret           string
	SQLiteJournalMode   string
	SQLiteSynchronous   string
	SQLiteBusyTimeoutMS int
	SQLiteForeignKeysOn bool
}

func Load() Config {
	return Config{
		Port:                getEnv("PORT", "8080"),
		Env:                 getEnv("ENV", "development"),
		DBPath:              getEnv("DB_PATH", "./data/app.db"),
		JWTSecret:           getEnv("JWT_SECRET", "dev-change-me"),
		SQLiteJournalMode:   getEnv("SQLITE_JOURNAL_MODE", "WAL"),
		SQLiteSynchronous:   getEnv("SQLITE_SYNCHRONOUS", "NORMAL"),
		SQLiteBusyTimeoutMS: getEnvInt("SQLITE_BUSY_TIMEOUT_MS", 5000),
		SQLiteForeignKeysOn: getEnvBool("SQLITE_FOREIGN_KEYS", true),
	}
}

func (c Config) Address() string {
	return ":" + c.Port
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
