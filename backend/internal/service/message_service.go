package service

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/redis"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
)

type MessageService struct {
	repo        *repository.MessageRepository
	redisClient *redis.Client
}

func NewMessageService(repo *repository.MessageRepository, redisClient *redis.Client) *MessageService {
	return &MessageService{repo: repo, redisClient: redisClient}
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

	s.publishNewMessage(message)

	return message, nil
}

func (s *MessageService) GetConversation(userID, otherUserID uuid.UUID, page, limit int) ([]domain.Message, int64, error) {
	cacheKey := conversationCacheKey(userID, otherUserID, page, limit)

	if s.redisClient != nil && s.redisClient.IsConnected() {
		ctx := context.Background()
		if cached, err := s.redisClient.Get(ctx, cacheKey); err == nil {
			var result struct {
				Messages []domain.Message
				Total    int64
			}
			if json.Unmarshal([]byte(cached), &result) == nil {
				return result.Messages, result.Total, nil
			}
		}
	}

	messages, total, err := s.repo.FindConversation(userID, otherUserID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	if s.redisClient != nil && s.redisClient.IsConnected() && page == 1 {
		ctx := context.Background()
		result := struct {
			Messages []domain.Message
			Total    int64
		}{messages, total}
		if data, err := json.Marshal(result); err == nil {
			s.redisClient.Set(ctx, cacheKey, data, 5*time.Minute)
		}
	}

	return messages, total, nil
}

func (s *MessageService) GetConversations(userID uuid.UUID) ([]map[string]interface{}, error) {
	return s.repo.GetConversationList(userID)
}

func (s *MessageService) MarkAsRead(messageID, userID uuid.UUID) error {
	err := s.repo.MarkAsRead(messageID, userID)
	if err != nil {
		return err
	}

	s.invalidateUnreadCache(userID)
	return nil
}

func (s *MessageService) GetUnreadCount(userID uuid.UUID) (int64, error) {
	cacheKey := unreadCountCacheKey(userID)

	if s.redisClient != nil && s.redisClient.IsConnected() {
		ctx := context.Background()
		if cached, err := s.redisClient.Get(ctx, cacheKey); err == nil {
			var count int64
			if json.Unmarshal([]byte(cached), &count) == nil {
				return count, nil
			}
		}
	}

	count, err := s.repo.CountUnread(userID)
	if err != nil {
		return 0, err
	}

	if s.redisClient != nil && s.redisClient.IsConnected() {
		ctx := context.Background()
		if data, err := json.Marshal(count); err == nil {
			s.redisClient.Set(ctx, cacheKey, data, 30*time.Second)
		}
	}

	return count, nil
}

func (s *MessageService) publishNewMessage(message *domain.Message) {
	if s.redisClient == nil || !s.redisClient.IsConnected() {
		return
	}

	ctx := context.Background()
	channel := "user:" + message.ReceiverID.String() + ":messages"
	event := map[string]interface{}{
		"type":    "new_message",
		"message": message,
	}
	if data, err := json.Marshal(event); err == nil {
		s.redisClient.Publish(ctx, channel, data)
	}

	s.invalidateUnreadCache(message.ReceiverID)
}

func (s *MessageService) invalidateUnreadCache(userID uuid.UUID) {
	if s.redisClient == nil || !s.redisClient.IsConnected() {
		return
	}

	ctx := context.Background()
	cacheKey := unreadCountCacheKey(userID)
	s.redisClient.Del(ctx, cacheKey)
}

func conversationCacheKey(userID, otherUserID uuid.UUID, page, limit int) string {
	return "conversation:" + userID.String() + ":" + otherUserID.String() + ":" +
		string(rune('0'+page)) + ":" + string(rune('0'+limit))
}

func unreadCountCacheKey(userID uuid.UUID) string {
	return "unread:" + userID.String()
}
