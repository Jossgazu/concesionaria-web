package config

import (
	"net/url"
	"os"
	"strconv"
	"strings"
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
	RedisURL    string
}

func Load() *Config {
	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		cfg := &Config{
			DatabaseURL: dbURL,
			JWTSecret:   getEnv("JWT_SECRET", "concesionaria-secret-key-2024"),
			ServerPort:  getEnv("PORT", "3000"),
			UploadPath:  getEnv("UPLOAD_DIR", "./uploads"),
			RedisURL:    getEnv("REDIS_URL", ""),
		}
		cfg.parseDatabaseURL(dbURL)
		return cfg
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
		RedisURL:   getEnv("REDIS_URL", ""),
	}
}

func (c *Config) parseDatabaseURL(dbURL string) {
	u, err := url.Parse(dbURL)
	if err != nil {
		return
	}

	c.DBHost = u.Hostname()
	if port := u.Port(); port != "" {
		c.DBPort, _ = strconv.Atoi(port)
	} else {
		c.DBPort = 5432
	}

	c.DBUser = u.User.Username()
	c.DBPassword, _ = u.User.Password()

	path := strings.TrimPrefix(u.Path, "/")
	if path != "" {
		c.DBName = path
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
