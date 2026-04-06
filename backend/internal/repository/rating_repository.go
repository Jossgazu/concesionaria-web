package repository

import (
	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RatingRepository struct {
	db *gorm.DB
}

func NewRatingRepository(db *gorm.DB) *RatingRepository {
	return &RatingRepository{db: db}
}

func (r *RatingRepository) Create(rating *domain.Rating) error {
	return r.db.Create(rating).Error
}

func (r *RatingRepository) FindByTargetID(targetID uuid.UUID, page, limit int) ([]domain.Rating, int64, error) {
	var ratings []domain.Rating
	var total int64

	r.db.Model(&domain.Rating{}).Where("rated_user_id = ?", targetID).Count(&total)

	offset := (page - 1) * limit
	err := r.db.Preload("Rater").Where("rated_user_id = ?", targetID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&ratings).Error
	if err != nil {
		return nil, 0, err
	}

	return ratings, total, nil
}

func (r *RatingRepository) GetAverageRating(targetID uuid.UUID) (float64, error) {
	var result struct {
		Avg float64
	}
	err := r.db.Model(&domain.Rating{}).Where("rated_user_id = ?", targetID).Select("AVG(score) as avg").Scan(&result).Error
	if err != nil {
		return 0, err
	}
	return result.Avg, nil
}

func (r *RatingRepository) CountByTarget(targetID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Rating{}).Where("rated_user_id = ?", targetID).Count(&count).Error
	return count, err
}

func (r *RatingRepository) FindByUserID(userID uuid.UUID, page, limit int) ([]domain.Rating, int64, error) {
	var ratings []domain.Rating
	var total int64

	query := r.db.Model(&domain.Rating{}).Where("rated_user_id = ?", userID)
	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Order("created_at DESC").Offset(offset).Limit(limit).
		Preload("Rater").
		Find(&ratings).Error

	return ratings, total, err
}

func (r *RatingRepository) GetUserSummary(userID uuid.UUID) (*RatingSummary, error) {
	var summary RatingSummary

	r.db.Model(&domain.Rating{}).Where("rated_user_id = ?", userID).
		Select("COUNT(*) as total, COALESCE(AVG(score), 0) as average").
		Scan(&summary)

	r.db.Model(&domain.Rating{}).Where("rated_user_id = ? AND score = 5", userID).Count((*int64)(&summary.FiveStar))
	r.db.Model(&domain.Rating{}).Where("rated_user_id = ? AND score = 4", userID).Count((*int64)(&summary.FourStar))
	r.db.Model(&domain.Rating{}).Where("rated_user_id = ? AND score = 3", userID).Count((*int64)(&summary.ThreeStar))
	r.db.Model(&domain.Rating{}).Where("rated_user_id = ? AND score = 2", userID).Count((*int64)(&summary.TwoStar))
	r.db.Model(&domain.Rating{}).Where("rated_user_id = ? AND score = 1", userID).Count((*int64)(&summary.OneStar))

	return &summary, nil
}

func (r *RatingRepository) HasRatedTransaction(raterID, ratedUserID, transactionID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.Model(&domain.Rating{}).
		Where("rater_id = ? AND rated_user_id = ? AND transaction_id = ?",
			raterID, ratedUserID, transactionID).
		Count(&count).Error
	return count > 0, err
}

func (r *RatingRepository) UpdateSellerResponse(ratingID, sellerID uuid.UUID, response string) error {
	return r.db.Model(&domain.Rating{}).
		Where("id = ? AND rated_user_id = ?", ratingID, sellerID).
		Update("seller_response", response).Error
}

func (r *RatingRepository) FindByID(ratingID uuid.UUID) (*domain.Rating, error) {
	var rating domain.Rating
	err := r.db.First(&rating, "id = ?", ratingID).Error
	if err != nil {
		return nil, err
	}
	return &rating, nil
}

type RatingSummary struct {
	Total     int64
	Average   float64 `json:"average"`
	FiveStar  int64   `json:"five_star"`
	FourStar  int64   `json:"four_star"`
	ThreeStar int64   `json:"three_star"`
	TwoStar   int64   `json:"two_star"`
	OneStar   int64   `json:"one_star"`
}
