package repository

import (
	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ValuationRepository struct {
	db *gorm.DB
}

func NewValuationRepository(db *gorm.DB) *ValuationRepository {
	return &ValuationRepository{db: db}
}

func (r *ValuationRepository) Create(valuation *domain.Valuation) error {
	return r.db.Create(valuation).Error
}

func (r *ValuationRepository) FindByUserID(userID uuid.UUID) ([]domain.Valuation, error) {
	var valuations []domain.Valuation
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&valuations).Error
	return valuations, err
}

func (r *ValuationRepository) FindByIDAndUser(id, userID uuid.UUID) (*domain.Valuation, error) {
	var valuation domain.Valuation
	err := r.db.Where("id = ? AND user_id = ?", id, userID).First(&valuation).Error
	return &valuation, err
}
