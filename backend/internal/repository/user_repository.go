package repository

import (
	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByID(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, "id = ? AND deleted_at IS NULL", id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, "email = ?", email).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *domain.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) UpdateAvatar(id uuid.UUID, avatarURL string) error {
	return r.db.Model(&domain.User{}).Where("id = ?", id).Update("avatar_url", avatarURL).Error
}

func (r *UserRepository) GetSellerStats(sellerID uuid.UUID) (*SellerStats, error) {
	var stats SellerStats

	r.db.Model(&domain.Vehicle{}).Where("seller_id = ? AND deleted_at IS NULL", sellerID).Count(&stats.TotalVehicles)

	r.db.Model(&domain.Vehicle{}).Where("seller_id = ? AND status = 'active' AND deleted_at IS NULL", sellerID).Count(&stats.ActiveVehicles)

	r.db.Model(&domain.Vehicle{}).Where("seller_id = ? AND deleted_at IS NULL", sellerID).Select("COALESCE(SUM(views), 0)").Scan(&stats.TotalViews)

	r.db.Model(&domain.Rating{}).Where("target_id = ?", sellerID).Count(&stats.TotalReviews)
	r.db.Model(&domain.Rating{}).Where("target_id = ?", sellerID).Select("COALESCE(AVG(score), 0)").Scan(&stats.AverageRating)

	return &stats, nil
}

type SellerStats struct {
	TotalVehicles  int64
	ActiveVehicles int64
	TotalViews     int64
	TotalReviews   int64
	AverageRating  float64
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.User{}, "id = ?", id).Error
}

func (r *UserRepository) FindAll(page, limit int) ([]domain.User, int64, error) {
	var users []domain.User
	var total int64

	r.db.Model(&domain.User{}).Count(&total)

	offset := (page - 1) * limit
	err := r.db.Offset(offset).Limit(limit).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

func (r *UserRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&domain.User{}).Count(&count).Error
	return count, err
}
