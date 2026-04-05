package dto

import "github.com/google/uuid"

type CreateValuationRequest struct {
	VehicleID uuid.UUID `json:"vehicle_id" validate:"required"`
	Year      int       `json:"year" validate:"required"`
	Mileage   int       `json:"mileage" validate:"required"`
	Condition string    `json:"condition" validate:"required"`
}

type ListValuationsRequest struct {
	VehicleID uuid.UUID `query:"vehicle_id"`
	Page      int       `query:"page"`
	Limit     int       `query:"limit"`
}
