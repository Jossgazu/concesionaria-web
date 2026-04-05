package service

import (
	"errors"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
)

type FavoriteService struct {
	repo *repository.FavoriteRepository
}

func NewFavoriteService(repo *repository.FavoriteRepository) *FavoriteService {
	return &FavoriteService{repo: repo}
}

func (s *FavoriteService) AddFavorite(userID, vehicleID uuid.UUID) error {
	vehicle, err := s.repo.GetVehicle(vehicleID)
	if err != nil {
		return errors.New("vehicle not found")
	}

	_ = vehicle

	exists, _ := s.repo.Exists(userID, vehicleID)
	if exists {
		return errors.New("already in favorites")
	}

	return s.repo.Create(userID, vehicleID)
}

func (s *FavoriteService) RemoveFavorite(userID, vehicleID uuid.UUID) error {
	return s.repo.Delete(userID, vehicleID)
}

func (s *FavoriteService) GetUserFavorites(userID uuid.UUID) ([]domain.Favorite, error) {
	return s.repo.FindByUserID(userID)
}
