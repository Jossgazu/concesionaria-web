package handler

import (
	"github.com/concesionaria-web/backend/internal/service"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type FavoriteHandler struct {
	service *service.FavoriteService
}

func NewFavoriteHandler(service *service.FavoriteService) *FavoriteHandler {
	return &FavoriteHandler{service: service}
}

func (h *FavoriteHandler) AddFavorite(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))
	vehicleID, err := uuid.Parse(c.Params("vehicleId"))
	if err != nil {
		return response.BadRequest(c, "Invalid vehicle ID")
	}

	if err := h.service.AddFavorite(userID, vehicleID); err != nil {
		if err.Error() == "vehicle not found" {
			return response.NotFound(c, "Vehicle not found")
		}
		if err.Error() == "already in favorites" {
			return response.BadRequest(c, "Already in favorites")
		}
		return response.InternalError(c, "Failed to add favorite")
	}

	return c.JSON(fiber.Map{"message": "Added to favorites"})
}

func (h *FavoriteHandler) RemoveFavorite(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))
	vehicleID, err := uuid.Parse(c.Params("vehicleId"))
	if err != nil {
		return response.BadRequest(c, "Invalid vehicle ID")
	}

	if err := h.service.RemoveFavorite(userID, vehicleID); err != nil {
		return response.InternalError(c, "Failed to remove favorite")
	}

	return c.JSON(fiber.Map{"message": "Removed from favorites"})
}

func (h *FavoriteHandler) GetFavorites(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	favorites, err := h.service.GetUserFavorites(userID)
	if err != nil {
		return response.InternalError(c, "Failed to fetch favorites")
	}

	data := make([]map[string]interface{}, len(favorites))
	for i, f := range favorites {
		data[i] = map[string]interface{}{
			"id":         f.ID,
			"vehicle":    f.Vehicle,
			"created_at": f.CreatedAt,
		}
	}

	return c.JSON(fiber.Map{"data": data})
}
