package repository

import (
	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FavoriteRepository struct {
	db *gorm.DB
}

func NewFavoriteRepository(db *gorm.DB) *FavoriteRepository {
	return &FavoriteRepository{db: db}
}

func (r *FavoriteRepository) Create(userID, vehicleID uuid.UUID) error {
	favorite := &domain.Favorite{
		UserID:    userID,
		VehicleID: vehicleID,
	}
	return r.db.Create(favorite).Error
}

func (r *FavoriteRepository) Delete(userID, vehicleID uuid.UUID) error {
	return r.db.Where("user_id = ? AND vehicle_id = ?", userID, vehicleID).Delete(&domain.Favorite{}).Error
}

func (r *FavoriteRepository) Exists(userID, vehicleID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&domain.Favorite{}).Where("user_id = ? AND vehicle_id = ?", userID, vehicleID).Count(&count).Error
	return count > 0, err
}

func (r *FavoriteRepository) FindByUserID(userID uuid.UUID) ([]domain.Favorite, error) {
	var favorites []domain.Favorite
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").
		Preload("Vehicle").Preload("Vehicle.Images", "is_primary = true").
		Preload("Vehicle.Seller").
		Find(&favorites).Error
	return favorites, err
}

func (r *FavoriteRepository) GetVehicle(vehicleID uuid.UUID) (*domain.Vehicle, error) {
	var vehicle domain.Vehicle
	err := r.db.First(&vehicle, "id = ? AND deleted_at IS NULL", vehicleID).Error
	return &vehicle, err
}
