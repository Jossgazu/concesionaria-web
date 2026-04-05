package dto

import "github.com/google/uuid"

type AddFavoriteRequest struct {
	VehicleID uuid.UUID `json:"vehicle_id" validate:"required"`
}

type ListFavoritesRequest struct {
	Page  int `query:"page"`
	Limit int `query:"limit"`
}
