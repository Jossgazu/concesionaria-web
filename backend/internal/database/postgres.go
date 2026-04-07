package database

import (
	"fmt"

	"github.com/concesionaria-web/backend/internal/config"
	"github.com/concesionaria-web/backend/internal/domain"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get sql.DB: %w", err)
	}

	var tableCount int
	sqlDB.QueryRow("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'vehicles')").Scan(&tableCount)

	if tableCount == 0 {
		err = db.AutoMigrate(
			&domain.User{},
			&domain.Vehicle{},
			&domain.VehicleImage{},
			&domain.VehicleSpecs{},
			&domain.Valuation{},
			&domain.Favorite{},
			&domain.Rating{},
			&domain.Message{},
		)
		if err != nil {
			return nil, fmt.Errorf("failed to migrate database: %w", err)
		}
	}

	return db, nil
}
