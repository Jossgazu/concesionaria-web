package config

import (
	"os"
	"strconv"
)

type Config struct {
	DatabaseURL string
	DBHost      string
	DBPort      int
	DBUser      string
	DBPassword  string
	DBName      string
	JWTSecret   string
	ServerPort  string
	UploadPath  string
}

func Load() *Config {
	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		return &Config{
			DatabaseURL: dbURL,
			JWTSecret:   getEnv("JWT_SECRET", "concesionaria-secret-key-2024"),
			ServerPort:  getEnv("PORT", "3000"),
			UploadPath:  getEnv("UPLOAD_DIR", "./uploads"),
		}
	}

	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnvInt("DB_PORT", 5432),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "postgres"),
		DBName:     getEnv("DB_NAME", "concesionaria"),
		JWTSecret:  getEnv("JWT_SECRET", "concesionaria-secret-key-2024"),
		ServerPort: getEnv("PORT", "3000"),
		UploadPath: getEnv("UPLOAD_DIR", "./uploads"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}
