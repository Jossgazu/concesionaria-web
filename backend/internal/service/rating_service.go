package service

import (
	"errors"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
)

type RatingService struct {
	ratingRepo *repository.RatingRepository
	userRepo   *repository.UserRepository
}

func NewRatingService(ratingRepo *repository.RatingRepository, userRepo *repository.UserRepository) *RatingService {
	return &RatingService{
		ratingRepo: ratingRepo,
		userRepo:   userRepo,
	}
}

type CreateRatingRequest struct {
	TargetID uuid.UUID `json:"target_id"`
	Score    int       `json:"score"`
	Comment  string    `json:"comment"`
}

func (s *RatingService) Create(raterID uuid.UUID, req *CreateRatingRequest) (*domain.Rating, error) {
	if raterID == req.TargetID {
		return nil, errors.New("cannot rate yourself")
	}

	if req.Score < 1 || req.Score > 5 {
		return nil, errors.New("score must be between 1 and 5")
	}

	_, err := s.userRepo.FindByID(req.TargetID)
	if err != nil {
		return nil, errors.New("target user not found")
	}

	rating := &domain.Rating{
		RaterID:  raterID,
		TargetID: req.TargetID,
		Score:    req.Score,
		Comment:  req.Comment,
	}

	err = s.ratingRepo.Create(rating)
	if err != nil {
		return nil, err
	}

	return rating, nil
}

func (s *RatingService) GetByTarget(targetID uuid.UUID, page, limit int) ([]domain.Rating, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	return s.ratingRepo.FindByTargetID(targetID, page, limit)
}

func (s *RatingService) GetUserSummary(targetID uuid.UUID) (float64, int64, error) {
	avg, err := s.ratingRepo.GetAverageRating(targetID)
	if err != nil {
		return 0, 0, err
	}

	count, err := s.ratingRepo.CountByTarget(targetID)
	if err != nil {
		return 0, 0, err
	}

	return avg, count, nil
}
