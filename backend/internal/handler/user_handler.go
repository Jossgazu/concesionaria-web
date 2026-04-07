package handler

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type UserHandler struct {
	userRepo    *repository.UserRepository
	vehicleRepo *repository.VehicleRepository
	ratingRepo  *repository.RatingRepository
	uploadDir   string
}

func NewUserHandler(userRepo *repository.UserRepository, vehicleRepo *repository.VehicleRepository, ratingRepo *repository.RatingRepository, uploadDir string) *UserHandler {
	return &UserHandler{
		userRepo:    userRepo,
		vehicleRepo: vehicleRepo,
		ratingRepo:  ratingRepo,
		uploadDir:   uploadDir,
	}
}

type ProfileResponse struct {
	ID            string                    `json:"id"`
	Email         string                    `json:"email"`
	Name          string                    `json:"name"`
	Phone         string                    `json:"phone"`
	Role          string                    `json:"role"`
	AvatarURL     string                    `json:"avatar_url"`
	Bio           string                    `json:"bio"`
	CreatedAt     string                    `json:"created_at"`
	Stats         *repository.SellerStats   `json:"stats,omitempty"`
	RatingSummary *repository.RatingSummary `json:"rating_summary,omitempty"`
}

func (h *UserHandler) GetProfile(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	user, err := h.userRepo.FindByID(userID)
	if err != nil {
		return response.NotFound(c, "User not found")
	}

	stats, _ := h.userRepo.GetSellerStats(userID)
	ratingSummary, _ := h.ratingRepo.GetUserSummary(userID)

	res := ProfileResponse{
		ID:            user.ID.String(),
		Email:         user.Email,
		Name:          user.Name,
		Phone:         user.Phone,
		Role:          user.Role,
		AvatarURL:     user.AvatarURL,
		Bio:           user.Bio,
		CreatedAt:     user.CreatedAt.Format(time.RFC3339),
		Stats:         stats,
		RatingSummary: ratingSummary,
	}

	return c.JSON(res)
}

func (h *UserHandler) UpdateProfile(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	var req UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request")
	}

	user, err := h.userRepo.FindByID(userID)
	if err != nil {
		return response.NotFound(c, "User not found")
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.Bio != "" {
		user.Bio = req.Bio
	}

	if err := h.userRepo.Update(user); err != nil {
		return response.InternalError(c, "Failed to update profile")
	}

	return c.JSON(fiber.Map{"message": "Profile updated"})
}

func (h *UserHandler) UploadAvatar(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	file, err := c.FormFile("avatar")
	if err != nil {
		return response.BadRequest(c, "No file uploaded")
	}

	if file.Size > 2*1024*1024 {
		return response.BadRequest(c, "File too large. Max 2MB")
	}

	contentType := file.Header.Get("Content-Type")
	if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/webp" {
		return response.BadRequest(c, "Invalid file type")
	}

	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s_avatar%s", userID.String(), ext)

	dir := filepath.Join(h.uploadDir, "avatars")
	os.MkdirAll(dir, 0755)
	filepath := filepath.Join(dir, filename)

	if err := c.SaveFile(file, filepath); err != nil {
		return response.InternalError(c, "Failed to save avatar")
	}

	avatarURL := fmt.Sprintf("/uploads/avatars/%s", filename)
	h.userRepo.UpdateAvatar(userID, avatarURL)

	return c.JSON(fiber.Map{"url": avatarURL})
}

func (h *UserHandler) GetPublicProfile(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid user ID")
	}

	user, err := h.userRepo.FindByID(userID)
	if err != nil {
		return response.NotFound(c, "User not found")
	}

	stats, _ := h.userRepo.GetSellerStats(userID)
	ratingSummary, _ := h.ratingRepo.GetUserSummary(userID)

	vehicles, _, _ := h.vehicleRepo.FindAll(repository.VehicleFilter{SellerID: &userID, Status: "active", Limit: 10})

	res := ProfileResponse{
		ID:            user.ID.String(),
		Name:          user.Name,
		Role:          user.Role,
		AvatarURL:     user.AvatarURL,
		Bio:           user.Bio,
		CreatedAt:     user.CreatedAt.Format(time.RFC3339),
		Stats:         stats,
		RatingSummary: ratingSummary,
	}

	return c.JSON(fiber.Map{
		"profile":  res,
		"vehicles": vehicles,
	})
}

func (h *UserHandler) GetUserVehicles(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid user ID")
	}

	vehicles, total, err := h.vehicleRepo.FindAll(repository.VehicleFilter{SellerID: &userID})
	if err != nil {
		return response.InternalError(c, "Failed to fetch vehicles")
	}

	return c.JSON(fiber.Map{"data": vehicles, "total": total})
}

func (h *UserHandler) GetUserRatings(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("userId"))
	if err != nil {
		return response.BadRequest(c, "Invalid user ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10)

	ratings, total, err := h.ratingRepo.FindByUserID(userID, page, limit)
	if err != nil {
		return response.InternalError(c, "Failed to fetch ratings")
	}

	return c.JSON(fiber.Map{
		"data":  ratings,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

type UpdateProfileRequest struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Bio   string `json:"bio"`
}

func (h *UserHandler) vehicleToResponse(v *domain.Vehicle) fiber.Map {
	images := make([]fiber.Map, len(v.Images))
	for i, img := range v.Images {
		images[i] = fiber.Map{
			"id":         img.ID,
			"vehicle_id": img.VehicleID,
			"image_url":  img.ImageURL,
			"is_primary": img.IsPrimary,
		}
	}

	return fiber.Map{
		"id":           v.ID,
		"seller_id":    v.SellerID,
		"brand":        v.Brand,
		"model":        v.Model,
		"year":         v.Year,
		"price":        v.Price.InexactFloat64(),
		"currency":     v.Currency,
		"mileage":      v.Mileage,
		"body_type":    v.BodyType,
		"fuel_type":    v.FuelType,
		"transmission": v.Transmission,
		"color":        v.Color,
		"description":  v.Description,
		"status":       v.Status,
		"verified":     v.Verified,
		"views":        v.Views,
		"images":       images,
		"created_at":   v.CreatedAt,
	}
}
