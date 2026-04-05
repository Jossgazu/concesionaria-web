package service

import (
	"errors"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
)

type MessageService struct {
	repo *repository.MessageRepository
}

func NewMessageService(repo *repository.MessageRepository) *MessageService {
	return &MessageService{repo: repo}
}

type SendMessageRequest struct {
	ReceiverID string  `json:"receiver_id" validate:"required"`
	Content    string  `json:"content" validate:"required,min=1"`
	VehicleID  *string `json:"vehicle_id"`
}

func (s *MessageService) SendMessage(senderID uuid.UUID, req SendMessageRequest) (*domain.Message, error) {
	receiverID, err := uuid.Parse(req.ReceiverID)
	if err != nil {
		return nil, errors.New("invalid receiver ID")
	}

	if senderID == receiverID {
		return nil, errors.New("cannot message yourself")
	}

	_, err = s.repo.GetUser(receiverID)
	if err != nil {
		return nil, errors.New("receiver not found")
	}

	message := &domain.Message{
		SenderID:   senderID,
		ReceiverID: receiverID,
		Content:    req.Content,
	}

	if req.VehicleID != nil {
		vehicleID, _ := uuid.Parse(*req.VehicleID)
		message.VehicleID = &vehicleID
	}

	if err := s.repo.Create(message); err != nil {
		return nil, err
	}

	return message, nil
}

func (s *MessageService) GetConversation(userID, otherUserID uuid.UUID, page, limit int) ([]domain.Message, int64, error) {
	return s.repo.FindConversation(userID, otherUserID, page, limit)
}

func (s *MessageService) GetConversations(userID uuid.UUID) ([]map[string]interface{}, error) {
	return s.repo.GetConversationList(userID)
}

func (s *MessageService) MarkAsRead(messageID, userID uuid.UUID) error {
	return s.repo.MarkAsRead(messageID, userID)
}
