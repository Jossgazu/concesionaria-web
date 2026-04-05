package dto

import "github.com/google/uuid"

type CreateVehicleRequest struct {
	Brand        string  `json:"brand" validate:"required"`
	Model        string  `json:"model" validate:"required"`
	Year         int     `json:"year" validate:"required"`
	Price        float64 `json:"price" validate:"required"`
	Currency     string  `json:"currency"`
	Mileage      int     `json:"mileage" validate:"required"`
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
	Currency     string  `json:"currency"`
	Mileage      int     `json:"mileage"`
	BodyType     string  `json:"body_type"`
	FuelType     string  `json:"fuel_type"`
	Transmission string  `json:"transmission"`
	Color        string  `json:"color"`
	Description  string  `json:"description"`
	Status       string  `json:"status"`
}

type VehicleFilterRequest struct {
	Brand     string    `query:"brand"`
	Model     string    `query:"model"`
	MinPrice  float64   `query:"min_price"`
	MaxPrice  float64   `query:"max_price"`
	MinYear   int       `query:"min_year"`
	MaxYear   int       `query:"max_year"`
	BodyType  string    `query:"body_type"`
	FuelType  string    `query:"fuel_type"`
	Status    string    `query:"status"`
	Verified  *bool     `query:"verified"`
	SellerID  uuid.UUID `query:"seller_id"`
	Search    string    `query:"search"`
	SortBy    string    `query:"sort_by"`
	SortOrder string    `query:"sort_order"`
	Page      int       `query:"page"`
	Limit     int       `query:"limit"`
}

type SetPrimaryImageRequest struct {
	ImageID uuid.UUID `json:"image_id" validate:"required"`
}

type CreateVehicleSpecsRequest struct {
	Engine             string   `json:"engine"`
	Horsepower         int      `json:"horsepower"`
	Torque             string   `json:"torque"`
	Displacement       float64  `json:"displacement"`
	TransmissionType   string   `json:"transmission_type"`
	Drivetrain         string   `json:"drivetrain"`
	FuelTankCapacity   float64  `json:"fuel_tank_capacity"`
	Seats              int      `json:"seats"`
	Doors              int      `json:"doors"`
	Weight             int      `json:"weight"`
	Length             float64  `json:"length"`
	Width              float64  `json:"width"`
	Height             float64  `json:"height"`
	TrunkCapacity      float64  `json:"trunk_capacity"`
	ConsumptionCity    float64  `json:"consumption_city"`
	ConsumptionHighway float64  `json:"consumption_highway"`
	Emissions          string   `json:"emissions"`
	SafetyFeatures     []string `json:"safety_features"`
	ComfortFeatures    []string `json:"comfort_features"`
	OtherFeatures      []string `json:"other_features"`
}
