package dto

import "github.com/google/uuid"

type CreateRatingRequest struct {
	TargetID uuid.UUID `json:"target_id" validate:"required"`
	Score    int       `json:"score" validate:"required,min=1,max=5"`
	Comment  string    `json:"comment"`
}

type ListRatingsRequest struct {
	TargetID uuid.UUID `query:"target_id"`
	Page     int       `query:"page"`
	Limit    int       `query:"limit"`
}
