package dto

type VehicleResponse struct {
	ID           string                 `json:"id"`
	SellerID     string                 `json:"seller_id"`
	Seller       *UserResponse          `json:"seller,omitempty"`
	Brand        string                 `json:"brand"`
	Model        string                 `json:"model"`
	Year         int                    `json:"year"`
	Price        float64                `json:"price"`
	Currency     string                 `json:"currency"`
	Mileage      int                    `json:"mileage"`
	BodyType     string                 `json:"body_type"`
	FuelType     string                 `json:"fuel_type"`
	Transmission string                 `json:"transmission"`
	Color        string                 `json:"color"`
	Description  string                 `json:"description"`
	Status       string                 `json:"status"`
	Verified     bool                   `json:"verified"`
	Views        int                    `json:"views"`
	Images       []VehicleImageResponse `json:"images,omitempty"`
	Specs        *VehicleSpecsResponse  `json:"specs,omitempty"`
	Valuation    *ValuationResponse     `json:"valuation,omitempty"`
	CreatedAt    string                 `json:"created_at"`
}

type VehicleImageResponse struct {
	ID        string `json:"id"`
	VehicleID string `json:"vehicle_id"`
	ImageURL  string `json:"image_url"`
	IsPrimary bool   `json:"is_primary"`
	SortOrder int    `json:"sort_order"`
}

type VehicleSpecsResponse struct {
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

type ValuationResponse struct {
	ID              string  `json:"id"`
	VehicleID       string  `json:"vehicle_id"`
	Year            int     `json:"year"`
	Mileage         int     `json:"mileage"`
	Condition       string  `json:"condition"`
	EstimatedPrice  float64 `json:"estimated_price"`
	Depreciation    float64 `json:"depreciation"`
	MileageFactor   float64 `json:"mileage_factor"`
	ConditionFactor float64 `json:"condition_factor"`
	CreatedAt       string  `json:"created_at"`
}

type DashboardStats struct {
	TotalUsers      int64 `json:"total_users"`
	TotalVehicles   int64 `json:"total_vehicles"`
	AvailableCars   int64 `json:"available_cars"`
	SoldCars        int64 `json:"sold_cars"`
	TotalValuations int64 `json:"total_valuations"`
	TotalFavorites  int64 `json:"total_favorites"`
	TotalMessages   int64 `json:"total_messages"`
}

type VehicleListResponse struct {
	Data       []VehicleResponse `json:"data"`
	Total      int64             `json:"total"`
	Page       int               `json:"page"`
	Limit      int               `json:"limit"`
	TotalPages int               `json:"total_pages"`
}
