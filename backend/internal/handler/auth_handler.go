package handler

import (
	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/service"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req service.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	user, token, err := h.authService.Register(&req)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"token":   token,
		"user":    h.userToResponse(user),
	})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req service.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	user, token, err := h.authService.Login(&req)
	if err != nil {
		return response.Unauthorized(c, err.Error())
	}

	return c.JSON(fiber.Map{
		"success": true,
		"token":   token,
		"user":    h.userToResponse(user),
	})
}

func (h *AuthHandler) Me(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	userID, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		return response.Unauthorized(c, "Invalid token")
	}

	user, err := h.authService.GetUserByID(userID)
	if err != nil {
		return response.NotFound(c, "User not found")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"user":    h.userToResponse(user),
	})
}

func (h *AuthHandler) userToResponse(user *domain.User) fiber.Map {
	return fiber.Map{
		"id":         user.ID,
		"email":      user.Email,
		"name":       user.Name,
		"phone":      user.Phone,
		"avatar_url": user.AvatarURL,
		"role":       user.Role,
		"created_at": user.CreatedAt,
	}
}
