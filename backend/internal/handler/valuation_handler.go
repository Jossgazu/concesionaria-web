package handler

import (
	"github.com/concesionaria-web/backend/internal/service"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ValuationHandler struct {
	service *service.ValuationService
}

func NewValuationHandler(service *service.ValuationService) *ValuationHandler {
	return &ValuationHandler{service: service}
}

func (h *ValuationHandler) CreateValuation(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	var req service.CreateValuationRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request")
	}

	if req.Year < 1900 || req.Year > 2026 {
		return response.BadRequest(c, "Año inválido")
	}

	if req.Mileage < 0 {
		return response.BadRequest(c, "Kilometraje inválido")
	}

	valuation, err := h.service.CreateValuation(userID, req)
	if err != nil {
		return response.InternalError(c, "Failed to create valuation")
	}

	return c.Status(fiber.StatusCreated).JSON(valuation)
}

func (h *ValuationHandler) GetValuations(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))

	valuations, err := h.service.GetUserValuations(userID)
	if err != nil {
		return response.InternalError(c, "Failed to fetch valuations")
	}

	return c.JSON(fiber.Map{"data": valuations})
}

func (h *ValuationHandler) GetValuation(c *fiber.Ctx) error {
	userID, _ := uuid.Parse(c.Locals("user_id").(string))
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return response.BadRequest(c, "Invalid ID")
	}

	valuation, err := h.service.GetValuationByID(id, userID)
	if err != nil {
		return response.NotFound(c, "Valuation not found")
	}

	return c.JSON(valuation)
}
