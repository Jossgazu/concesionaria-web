package dto

import "github.com/google/uuid"

type SendMessageRequest struct {
	ReceiverID uuid.UUID `json:"receiver_id" validate:"required"`
	VehicleID  uuid.UUID `json:"vehicle_id" validate:"required"`
	Content    string    `json:"content" validate:"required"`
}

type ListMessagesRequest struct {
	OtherUserID uuid.UUID `query:"other_user_id"`
	VehicleID   uuid.UUID `query:"vehicle_id"`
	Page        int       `query:"page"`
	Limit       int       `query:"limit"`
}

type ConversationRequest struct {
	Page  int `query:"page"`
	Limit int `query:"limit"`
}
