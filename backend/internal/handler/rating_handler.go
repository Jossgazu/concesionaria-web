package handler

import (
	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type RatingHandler struct {
	ratingRepo *repository.RatingRepository
	userRepo   *repository.UserRepository
}

func NewRatingHandler(ratingRepo *repository.RatingRepository, userRepo *repository.UserRepository) *RatingHandler {
	return &RatingHandler{
		ratingRepo: ratingRepo,
		userRepo:   userRepo,
	}
}

func (h *RatingHandler) Create(c *fiber.Ctx) error {
	raterID, _ := uuid.Parse(c.Locals("user_id").(string))

	var req CreateRatingRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request")
	}

	if raterID.String() == req.RatedUserID {
		return response.BadRequest(c, "Cannot rate yourself")
	}

	if req.Score < 1 || req.Score > 5 {
		return response.BadRequest(c, "Score must be between 1 and 5")
	}

	ratedUserID, _ := uuid.Parse(req.RatedUserID)

	rating := &domain.Rating{
		RaterID:  raterID,
		TargetID: ratedUserID,
		Score:    req.Score,
		Comment:  req.Comment,
	}

	if err := h.ratingRepo.Create(rating); err != nil {
		return response.InternalError(c, "Failed to create rating")
	}

	return c.Status(fiber.StatusCreated).JSON(rating)
}

func (h *RatingHandler) GetByTarget(c *fiber.Ctx) error {
	targetIDStr := c.Params("id")
	if targetIDStr == "" {
		return response.BadRequest(c, "Target ID is required")
	}

	targetID, err := uuid.Parse(targetIDStr)
	if err != nil {
		return response.BadRequest(c, "Invalid target ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)

	ratings, total, err := h.ratingRepo.FindByTargetID(targetID, page, limit)
	if err != nil {
		return response.InternalError(c, "Failed to fetch ratings")
	}

	ratingResponses := make([]interface{}, len(ratings))
	for i, r := range ratings {
		ratingResponses[i] = h.ratingToResponse(&r)
	}

	return response.Paginated(c, ratingResponses, page, limit, total)
}

func (h *RatingHandler) GetUserSummary(c *fiber.Ctx) error {
	targetIDStr := c.Params("id")
	if targetIDStr == "" {
		return response.BadRequest(c, "Target ID is required")
	}

	targetID, err := uuid.Parse(targetIDStr)
	if err != nil {
		return response.BadRequest(c, "Invalid target ID")
	}

	avgRating, totalRatings, err := h.getUserSummary(targetID)
	if err != nil {
		return response.InternalError(c, "Failed to fetch rating summary")
	}

	return response.Success(c, fiber.Map{
		"target_id":     targetID,
		"avg_rating":    avgRating,
		"total_ratings": totalRatings,
	})
}

func (h *RatingHandler) GetUserRatings(c *fiber.Ctx) error {
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

func (h *RatingHandler) GetUserRatingSummary(c *fiber.Ctx) error {
	userID, err := uuid.Parse(c.Params("userId"))
	if err != nil {
		return response.BadRequest(c, "Invalid user ID")
	}

	summary, err := h.ratingRepo.GetUserSummary(userID)
	if err != nil {
		return response.InternalError(c, "Failed to fetch rating summary")
	}

	return c.JSON(summary)
}

func (h *RatingHandler) RespondToRating(c *fiber.Ctx) error {
	sellerID, _ := uuid.Parse(c.Locals("user_id").(string))

	ratingIDStr := c.Params("id")
	ratingID, err := uuid.Parse(ratingIDStr)
	if err != nil {
		return response.BadRequest(c, "Invalid rating ID")
	}

	var req struct {
		Response string `json:"response"`
	}
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request")
	}

	rating, err := h.ratingRepo.FindByID(ratingID)
	if err != nil {
		return response.NotFound(c, "Rating not found")
	}

	if rating.TargetID != sellerID {
		return response.Unauthorized(c, "Not authorized to respond to this rating")
	}

	if err := h.ratingRepo.UpdateSellerResponse(ratingID, sellerID, req.Response); err != nil {
		return response.InternalError(c, "Failed to update response")
	}

	return response.Success(c, fiber.Map{"message": "Response added successfully"})
}

func (h *RatingHandler) ratingToResponse(r *domain.Rating) fiber.Map {
	return fiber.Map{
		"id":              r.ID,
		"rater_id":        r.RaterID,
		"target_id":       r.TargetID,
		"score":           r.Score,
		"comment":         r.Comment,
		"seller_response": r.SellerResponse,
		"created_at":      r.CreatedAt,
	}
}

func (h *RatingHandler) getUserSummary(targetID uuid.UUID) (float64, int64, error) {
	avg, err := h.ratingRepo.GetAverageRating(targetID)
	if err != nil {
		return 0, 0, err
	}

	count, err := h.ratingRepo.CountByTarget(targetID)
	if err != nil {
		return 0, 0, err
	}

	return avg, count, nil
}

type CreateRatingRequest struct {
	RatedUserID   string `json:"rated_user_id"`
	Score         int    `json:"score"`
	Comment       string `json:"comment"`
	TransactionID string `json:"transaction_id"`
	Direction     string `json:"direction"`
}
