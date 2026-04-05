package handler

import (
	"strconv"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/concesionaria-web/backend/internal/service"
	"github.com/concesionaria-web/backend/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type VehicleHandler struct {
	vehicleService *service.VehicleService
}

func NewVehicleHandler(vehicleService *service.VehicleService) *VehicleHandler {
	return &VehicleHandler{vehicleService: vehicleService}
}

func (h *VehicleHandler) Create(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	var req service.CreateVehicleRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	userID, _ := uuid.Parse(userIDStr.(string))
	vehicle, err := h.vehicleService.Create(userID, &req)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Created(c, h.vehicleToResponse(vehicle))
}

func (h *VehicleHandler) GetByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	if idStr == "" {
		return response.BadRequest(c, "Vehicle ID is required")
	}

	id, err := uuid.Parse(idStr)
	if err != nil {
		return response.BadRequest(c, "Invalid vehicle ID")
	}

	vehicle, err := h.vehicleService.GetByID(id)
	if err != nil {
		return response.NotFound(c, "Vehicle not found")
	}

	return response.Success(c, h.vehicleToResponse(vehicle))
}

func (h *VehicleHandler) Update(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	idStr := c.Params("id")
	if idStr == "" {
		return response.BadRequest(c, "Vehicle ID is required")
	}

	var req service.UpdateVehicleRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "Invalid request body")
	}

	id, _ := uuid.Parse(idStr)
	userID, _ := uuid.Parse(userIDStr.(string))

	vehicle, err := h.vehicleService.Update(id, userID, &req)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Success(c, h.vehicleToResponse(vehicle))
}

func (h *VehicleHandler) Delete(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	idStr := c.Params("id")
	if idStr == "" {
		return response.BadRequest(c, "Vehicle ID is required")
	}

	id, _ := uuid.Parse(idStr)
	userID, _ := uuid.Parse(userIDStr.(string))

	err := h.vehicleService.Delete(id, userID)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.SuccessWithMessage(c, "Vehicle deleted successfully", nil)
}

func (h *VehicleHandler) GetAll(c *fiber.Ctx) error {
	filter := repository.VehicleFilter{
		Brand:     c.Query("brand"),
		Model:     c.Query("model"),
		BodyType:  c.Query("body_type"),
		FuelType:  c.Query("fuel_type"),
		Status:    c.Query("status"),
		Search:    c.Query("search"),
		SortBy:    c.Query("sort_by"),
		SortOrder: c.Query("sort_order"),
		Page:      c.QueryInt("page", 1),
		Limit:     c.QueryInt("limit", 20),
	}

	if minPrice := c.Query("min_price"); minPrice != "" {
		val, _ := strconv.ParseFloat(minPrice, 64)
		filter.MinPrice = &val
	}

	if maxPrice := c.Query("max_price"); maxPrice != "" {
		val, _ := strconv.ParseFloat(maxPrice, 64)
		filter.MaxPrice = &val
	}

	if minYear := c.Query("min_year"); minYear != "" {
		val, _ := strconv.Atoi(minYear)
		filter.YearFrom = &val
	}

	if maxYear := c.Query("max_year"); maxYear != "" {
		val, _ := strconv.Atoi(maxYear)
		filter.YearTo = &val
	}

	if verified := c.Query("verified"); verified != "" {
		val, _ := strconv.ParseBool(verified)
		filter.Verified = &val
	}

	if sellerID := c.Query("seller_id"); sellerID != "" {
		if sid, err := uuid.Parse(sellerID); err == nil {
			filter.SellerID = &sid
		}
	}

	vehicles, total, err := h.vehicleService.GetAll(&filter)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	vehicleResponses := make([]interface{}, len(vehicles))
	for i, v := range vehicles {
		vehicleResponses[i] = h.vehicleToResponse(&v)
	}

	return response.Paginated(c, vehicleResponses, filter.Page, filter.Limit, total)
}

func (h *VehicleHandler) GetBySeller(c *fiber.Ctx) error {
	sellerIDStr := c.Params("sellerId")
	if sellerIDStr == "" {
		return response.BadRequest(c, "Seller ID is required")
	}

	sellerID, err := uuid.Parse(sellerIDStr)
	if err != nil {
		return response.BadRequest(c, "Invalid seller ID")
	}

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)

	vehicles, total, err := h.vehicleService.GetBySeller(sellerID, page, limit)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	vehicleResponses := make([]interface{}, len(vehicles))
	for i, v := range vehicles {
		vehicleResponses[i] = h.vehicleToResponse(&v)
	}

	return response.Paginated(c, vehicleResponses, page, limit, total)
}

func (h *VehicleHandler) GetFeatured(c *fiber.Ctx) error {
	limit := c.QueryInt("limit", 10)

	vehicles, err := h.vehicleService.GetFeatured(limit)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	vehicleResponses := make([]interface{}, len(vehicles))
	for i, v := range vehicles {
		vehicleResponses[i] = h.vehicleToResponse(&v)
	}

	return response.Success(c, vehicleResponses)
}

func (h *VehicleHandler) UploadImage(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	vehicleIDStr := c.Params("id")
	if vehicleIDStr == "" {
		return response.BadRequest(c, "Vehicle ID is required")
	}

	file, err := c.FormFile("image")
	if err != nil {
		return response.BadRequest(c, "No image uploaded")
	}

	contentType := file.Header.Get("Content-Type")
	if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/webp" {
		return response.BadRequest(c, "Invalid file type")
	}

	if file.Size > 5*1024*1024 {
		return response.BadRequest(c, "File too large")
	}

	filename := uuid.New().String() + ".jpg"
	filepath := "./uploads/vehicles/" + filename

	if err := c.SaveFile(file, filepath); err != nil {
		return response.InternalError(c, "Failed to save image")
	}

	url := "/uploads/vehicles/" + filename
	isPrimary := c.FormValue("is_primary") == "true"

	vehicleID, _ := uuid.Parse(vehicleIDStr)
	userID, _ := uuid.Parse(userIDStr.(string))

	image, err := h.vehicleService.AddImage(vehicleID, userID, url, isPrimary)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.Created(c, fiber.Map{
		"id":         image.ID,
		"vehicle_id": image.VehicleID,
		"url":        image.ImageURL,
		"is_primary": image.IsPrimary,
	})
}

func (h *VehicleHandler) DeleteImage(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	vehicleIDStr := c.Params("id")
	imageIDStr := c.Params("imageId")

	vehicleID, _ := uuid.Parse(vehicleIDStr)
	imageID, _ := uuid.Parse(imageIDStr)
	userID, _ := uuid.Parse(userIDStr.(string))

	err := h.vehicleService.DeleteImage(vehicleID, userID, imageID)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.SuccessWithMessage(c, "Image deleted successfully", nil)
}

func (h *VehicleHandler) SetPrimaryImage(c *fiber.Ctx) error {
	userIDStr := c.Locals("user_id")
	if userIDStr == nil {
		return response.Unauthorized(c, "Unauthorized")
	}

	vehicleIDStr := c.Params("id")
	imageIDStr := c.Params("imageId")

	vehicleID, _ := uuid.Parse(vehicleIDStr)
	imageID, _ := uuid.Parse(imageIDStr)
	userID, _ := uuid.Parse(userIDStr.(string))

	err := h.vehicleService.SetPrimaryImage(vehicleID, userID, imageID)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	return response.SuccessWithMessage(c, "Primary image set successfully", nil)
}

func (h *VehicleHandler) vehicleToResponse(v *domain.Vehicle) fiber.Map {
	images := make([]fiber.Map, len(v.Images))
	for i, img := range v.Images {
		images[i] = fiber.Map{
			"id":         img.ID,
			"vehicle_id": img.VehicleID,
			"image_url":  img.ImageURL,
			"is_primary": img.IsPrimary,
			"sort_order": img.SortOrder,
		}
	}

	specs := fiber.Map{}
	if v.Specs != nil {
		specs = fiber.Map{
			"engine":              v.Specs.Engine,
			"horsepower":          v.Specs.Horsepower,
			"torque":              v.Specs.Torque,
			"displacement":        v.Specs.Displacement,
			"transmission_type":   v.Specs.TransmissionType,
			"drivetrain":          v.Specs.Drivetrain,
			"fuel_tank_capacity":  v.Specs.FuelTankCapacity,
			"seats":               v.Specs.Seats,
			"doors":               v.Specs.Doors,
			"weight":              v.Specs.Weight,
			"length":              v.Specs.Length,
			"width":               v.Specs.Width,
			"height":              v.Specs.Height,
			"trunk_capacity":      v.Specs.TrunkCapacity,
			"consumption_city":    v.Specs.ConsumptionCity,
			"consumption_highway": v.Specs.ConsumptionHighway,
			"emissions":           v.Specs.Emissions,
			"safety_features":     v.Specs.SafetyFeatures,
			"comfort_features":    v.Specs.ComfortFeatures,
			"other_features":      v.Specs.OtherFeatures,
		}
	}

	seller := fiber.Map{}
	if v.Seller.ID.String() != "00000000-0000-0000-0000-000000000000" {
		seller = fiber.Map{
			"id":         v.Seller.ID,
			"name":       v.Seller.Name,
			"avatar_url": v.Seller.AvatarURL,
		}
	}

	return fiber.Map{
		"id":           v.ID,
		"seller_id":    v.SellerID,
		"seller":       seller,
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
		"specs":        specs,
		"created_at":   v.CreatedAt,
	}
}

func (h *VehicleHandler) GetDashboardStats(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	stats, err := h.vehicleService.GetSellerStats(userID)
	if err != nil {
		return response.InternalError(c, "Failed to fetch stats")
	}

	recentVehicles, _, _ := h.vehicleService.GetBySeller(userID, 1, 5)

	recentVehicleResponses := make([]interface{}, len(recentVehicles))
	for i, v := range recentVehicles {
		recentVehicleResponses[i] = h.vehicleToResponse(&v)
	}

	return c.JSON(fiber.Map{
		"stats":           stats,
		"recent_vehicles": recentVehicleResponses,
	})
}

func (h *VehicleHandler) GetSellerVehicles(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 20)

	vehicles, total, err := h.vehicleService.GetBySeller(userID, page, limit)
	if err != nil {
		return response.InternalError(c, err.Error())
	}

	vehicleResponses := make([]interface{}, len(vehicles))
	for i, v := range vehicles {
		vehicleResponses[i] = h.vehicleToResponse(&v)
	}

	return response.Paginated(c, vehicleResponses, page, limit, total)
}
