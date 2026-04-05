package handler

import (
	"github.com/concesionaria-web/backend/internal/service"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type MessageHandler struct {
	service *service.MessageService
}

func NewMessageHandler(service *service.MessageService) *MessageHandler {
	return &MessageHandler{service: service}
}

func (h *MessageHandler) SendMessage(c *fiber.Ctx) error {
	senderID, _ := uuid.Parse(c.Locals("user_id").(string))

	var req service.SendMessageRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request")
	}

	if req.Content == "" {
		return response.BadRequest(c, "Message content required")
	}

	message, err := h.service.SendMessage(senderID, req)
	if err != nil {
		if err.Error() == "cannot message yourself" {
			return response.BadRequest(c, "Cannot message yourself")
		}
		return response.InternalError(c, "Failed to send message")
	}

	return c.Status(fiber.StatusCreated).JSON(message)
}

func (h *MessageHandler) GetConversations(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	conversations, err := h.service.GetConversations(userID)
	if err != nil {
		return response.InternalError(c, "Failed to fetch conversations")
	}

	return c.JSON(fiber.Map{"data": conversations})
}

func (h *MessageHandler) GetConversation(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))
	otherUserID, err := uuid.Parse(c.Params("userId"))
	if err != nil {
		return response.BadRequest(c, "Invalid user ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 50)

	messages, total, err := h.service.GetConversation(userID, otherUserID, page, limit)
	if err != nil {
		return response.InternalError(c, "Failed to fetch messages")
	}

	return c.JSON(fiber.Map{
		"data":  messages,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *MessageHandler) MarkAsRead(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))
	messageID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid message ID")
	}

	if err := h.service.MarkAsRead(messageID, userID); err != nil {
		return response.InternalError(c, "Failed to mark as read")
	}

	return c.JSON(fiber.Map{"message": "Marked as read"})
}
