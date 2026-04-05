package service

import (
	"errors"
	"math"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type VehicleService struct {
	vehicleRepo *repository.VehicleRepository
	userRepo    *repository.UserRepository
}

func NewVehicleService(vehicleRepo *repository.VehicleRepository, userRepo *repository.UserRepository) *VehicleService {
	return &VehicleService{
		vehicleRepo: vehicleRepo,
		userRepo:    userRepo,
	}
}

type CreateVehicleRequest struct {
	Brand        string  `json:"brand"`
	Model        string  `json:"model"`
	Year         int     `json:"year"`
	Price        float64 `json:"price"`
	Negotiable   bool    `json:"negotiable"`
	Currency     string  `json:"currency"`
	Mileage      int     `json:"mileage"`
	BodyType     string  `json:"body_type"`
	FuelType     string  `json:"fuel_type"`
	Transmission string  `json:"transmission"`
	Color        string  `json:"color"`
	Description  string  `json:"description"`
}

type UpdateVehicleRequest struct {
	Brand        string  `json:"brand"`
	Model        string  `json:"model"`
	Year         int     `json:"year"`
	Price        float64 `json:"price"`
	Negotiable   bool    `json:"negotiable"`
	Currency     string  `json:"currency"`
	Mileage      int     `json:"mileage"`
	BodyType     string  `json:"body_type"`
	FuelType     string  `json:"fuel_type"`
	Transmission string  `json:"transmission"`
	Color        string  `json:"color"`
	Description  string  `json:"description"`
	Status       string  `json:"status"`
}

func (s *VehicleService) Create(sellerID uuid.UUID, req *CreateVehicleRequest) (*domain.Vehicle, error) {
	vehicle := &domain.Vehicle{
		SellerID:     sellerID,
		Brand:        req.Brand,
		Model:        req.Model,
		Year:         req.Year,
		Price:        decimal.NewFromFloat(req.Price),
		Negotiable:   req.Negotiable,
		Currency:     req.Currency,
		Mileage:      req.Mileage,
		BodyType:     req.BodyType,
		FuelType:     req.FuelType,
		Transmission: req.Transmission,
		Color:        req.Color,
		Description:  req.Description,
		Status:       "active",
		Verified:     false,
		Views:        0,
	}

	if vehicle.Currency == "" {
		vehicle.Currency = "USD"
	}

	err := s.vehicleRepo.Create(vehicle)
	if err != nil {
		return nil, err
	}

	return s.vehicleRepo.FindByID(vehicle.ID)
}

func (s *VehicleService) GetByID(id uuid.UUID) (*domain.Vehicle, error) {
	vehicle, err := s.vehicleRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	s.vehicleRepo.IncrementViews(id)
	return vehicle, nil
}

func (s *VehicleService) Update(id uuid.UUID, sellerID uuid.UUID, req *UpdateVehicleRequest) (*domain.Vehicle, error) {
	vehicle, err := s.vehicleRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	if vehicle.SellerID != sellerID {
		return nil, errors.New("unauthorized")
	}

	if req.Brand != "" {
		vehicle.Brand = req.Brand
	}
	if req.Model != "" {
		vehicle.Model = req.Model
	}
	if req.Year != 0 {
		vehicle.Year = req.Year
	}
	if req.Price != 0 {
		vehicle.Price = decimal.NewFromFloat(req.Price)
	}
	if req.Negotiable {
		vehicle.Negotiable = req.Negotiable
	}
	if req.Currency != "" {
		vehicle.Currency = req.Currency
	}
	if req.Mileage != 0 {
		vehicle.Mileage = req.Mileage
	}
	if req.BodyType != "" {
		vehicle.BodyType = req.BodyType
	}
	if req.FuelType != "" {
		vehicle.FuelType = req.FuelType
	}
	if req.Transmission != "" {
		vehicle.Transmission = req.Transmission
	}
	if req.Color != "" {
		vehicle.Color = req.Color
	}
	if req.Description != "" {
		vehicle.Description = req.Description
	}
	if req.Status != "" {
		vehicle.Status = req.Status
	}

	err = s.vehicleRepo.Update(vehicle)
	if err != nil {
		return nil, err
	}

	return s.vehicleRepo.FindByID(id)
}

func (s *VehicleService) Delete(id uuid.UUID, sellerID uuid.UUID) error {
	vehicle, err := s.vehicleRepo.FindByID(id)
	if err != nil {
		return err
	}

	if vehicle.SellerID != sellerID {
		return errors.New("unauthorized")
	}

	return s.vehicleRepo.Delete(id)
}

func (s *VehicleService) GetAll(filter *repository.VehicleFilter) ([]domain.Vehicle, int64, error) {
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 20
	}

	return s.vehicleRepo.FindAll(*filter)
}

func (s *VehicleService) GetBySeller(sellerID uuid.UUID, page, limit int) ([]domain.Vehicle, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	return s.vehicleRepo.FindBySeller(sellerID, page, limit)
}

func (s *VehicleService) GetFeatured(limit int) ([]domain.Vehicle, error) {
	if limit < 1 {
		limit = 10
	}

	return s.vehicleRepo.FindFeatured(limit)
}

func (s *VehicleService) AddImage(vehicleID uuid.UUID, sellerID uuid.UUID, url string, isPrimary bool) (*domain.VehicleImage, error) {
	vehicle, err := s.vehicleRepo.FindByID(vehicleID)
	if err != nil {
		return nil, err
	}

	if vehicle.SellerID != sellerID {
		return nil, errors.New("unauthorized")
	}

	image := &domain.VehicleImage{
		VehicleID: vehicleID,
		ImageURL:  url,
		IsPrimary: isPrimary,
	}

	err = s.vehicleRepo.AddImage(image)
	if err != nil {
		return nil, err
	}

	if isPrimary {
		_ = s.vehicleRepo.SetPrimaryImage(vehicleID, image.ID)
	}

	return image, nil
}

func (s *VehicleService) DeleteImage(vehicleID uuid.UUID, sellerID uuid.UUID, imageID uuid.UUID) error {
	vehicle, err := s.vehicleRepo.FindByID(vehicleID)
	if err != nil {
		return err
	}

	if vehicle.SellerID != sellerID {
		return errors.New("unauthorized")
	}

	image, err := s.vehicleRepo.FindImageByID(imageID)
	if err != nil {
		return err
	}

	if image.VehicleID != vehicleID {
		return errors.New("image does not belong to vehicle")
	}

	return s.vehicleRepo.DeleteImage(imageID)
}

func (s *VehicleService) SetPrimaryImage(vehicleID uuid.UUID, sellerID uuid.UUID, imageID uuid.UUID) error {
	vehicle, err := s.vehicleRepo.FindByID(vehicleID)
	if err != nil {
		return err
	}

	if vehicle.SellerID != sellerID {
		return errors.New("unauthorized")
	}

	image, err := s.vehicleRepo.FindImageByID(imageID)
	if err != nil {
		return err
	}

	if image.VehicleID != vehicleID {
		return errors.New("image does not belong to vehicle")
	}

	return s.vehicleRepo.SetPrimaryImage(vehicleID, imageID)
}

func (s *VehicleService) SetVerified(id uuid.UUID, verified bool) error {
	vehicle, err := s.vehicleRepo.FindByID(id)
	if err != nil {
		return err
	}

	vehicle.Verified = verified
	return s.vehicleRepo.Update(vehicle)
}

func (s *VehicleService) CalculateValuation(year, mileage int, condition string) (float64, float64, float64, float64) {
	basePrice := 10000.0

	age := 2024 - year
	depreciation := float64(age) * 0.10

	mileageFactor := float64(mileage) / 10000.0 * 0.05

	conditionFactorMap := map[string]float64{
		"excellent": 1.0,
		"good":      0.85,
		"fair":      0.70,
		"poor":      0.50,
	}
	conditionFactor := conditionFactorMap[condition]
	if conditionFactor == 0 {
		conditionFactor = 0.85
	}

	price := basePrice * (1 - depreciation - mileageFactor) * conditionFactor
	estimatedPrice := math.Max(price, 1000)

	return estimatedPrice, depreciation, mileageFactor, conditionFactor
}

func (s *VehicleService) GetSellerStats(sellerID uuid.UUID) (*repository.SellerStats, error) {
	return s.userRepo.GetSellerStats(sellerID)
}
