package config

import "os"

type Config struct {
	Port      string
	Env       string
	DBPath    string
	JWTSecret string
}

func Load() Config {
	return Config{
		Port:      getEnv("PORT", "8080"),
		Env:       getEnv("ENV", "development"),
		DBPath:    getEnv("DB_PATH", "./data/app.db"),
		JWTSecret: getEnv("JWT_SECRET", "dev-change-me"),
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
