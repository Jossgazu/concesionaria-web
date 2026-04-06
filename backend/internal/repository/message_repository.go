package repository

import (
	"time"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MessageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) *MessageRepository {
	return &MessageRepository{db: db}
}

func (r *MessageRepository) Create(message *domain.Message) error {
	return r.db.Create(message).Error
}

func (r *MessageRepository) FindConversation(user1, user2 uuid.UUID, page, limit int) ([]domain.Message, int64, error) {
	var messages []domain.Message
	var total int64

	query := r.db.Model(&domain.Message{}).
		Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
			user1, user2, user2, user1)

	query.Count(&total)

	offset := (page - 1) * limit
	err := query.Order("created_at DESC").Offset(offset).Limit(limit).
		Preload("Sender").Preload("Receiver").
		Find(&messages).Error

	return messages, total, err
}

func (r *MessageRepository) GetConversationList(userID uuid.UUID) ([]map[string]interface{}, error) {
	var results []map[string]interface{}

	rows, err := r.db.Raw(`
		SELECT
			CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as user_id,
			MAX(created_at) as last_message_at,
			COUNT(CASE WHEN is_read = false AND receiver_id = ? THEN 1 END) as unread_count
		FROM messages
		WHERE sender_id = ? OR receiver_id = ?
		GROUP BY user_id
		ORDER BY last_message_at DESC
	`, userID, userID, userID, userID).Rows()

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var otherUserID uuid.UUID
		var lastMessageAt *time.Time
		var unreadCount int64

		if err := rows.Scan(&otherUserID, &lastMessageAt, &unreadCount); err != nil {
			continue
		}

		var user domain.User
		r.db.First(&user, "id = ?", otherUserID)

		var lastMessage domain.Message
		r.db.Where("(sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
			userID, otherUserID, otherUserID, userID).
			Order("created_at DESC").
			First(&lastMessage)

		results = append(results, map[string]interface{}{
			"user":         user,
			"last_message": lastMessage,
			"unread_count": unreadCount,
		})
	}

	return results, nil
}

func (r *MessageRepository) MarkAsRead(messageID, userID uuid.UUID) error {
	return r.db.Model(&domain.Message{}).
		Where("id = ? AND receiver_id = ?", messageID, userID).
		Update("is_read", true).Error
}

func (r *MessageRepository) GetUser(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, "id = ?", id).Error
	return &user, err
}

func (r *MessageRepository) CountUnread(userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Message{}).
		Where("receiver_id = ? AND read = false", userID).
		Count(&count).Error
	return count, err
}
