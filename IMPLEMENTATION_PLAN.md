# Concesionaria Web - Backend Implementation Plan

## 1. Project Structure

```
concesionaria-web/
├── cmd/
│   └── server/
│       └── main.go
├── config/
│   └── config.go
├── internal/
│   ├── domain/
│   │   ├── user.go
│   │   ├── vehicle.go
│   │   ├── valuation.go
│   │   ├── favorite.go
│   │   ├── rating.go
│   │   ├── message.go
│   │   └── models.go
│   ├── repository/
│   │   ├── user_repository.go
│   │   ├── vehicle_repository.go
│   │   ├── valuation_repository.go
│   │   ├── favorite_repository.go
│   │   ├── rating_repository.go
│   │   ├── message_repository.go
│   │   └── interfaces.go
│   ├── service/
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   ├── vehicle_service.go
│   │   ├── valuation_service.go
│   │   ├── favorite_service.go
│   │   ├── rating_service.go
│   │   └── message_service.go
│   ├── handler/
│   │   ├── auth_handler.go
│   │   ├── user_handler.go
│   │   ├── vehicle_handler.go
│   │   ├── valuation_handler.go
│   │   ├── favorite_handler.go
│   │   ├── rating_handler.go
│   │   ├── message_handler.go
│   │   └── dashboard_handler.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── ratelimit.go
│   │   └── logger.go
│   ├── dto/
│   │   ├── request/
│   │   │   ├── auth.go
│   │   │   ├── user.go
│   │   │   ├── vehicle.go
│   │   │   ├── valuation.go
│   │   │   ├── rating.go
│   │   │   └── message.go
│   │   └── response/
│   │       ├── auth.go
│   │       ├── user.go
│   │       ├── vehicle.go
│   │       ├── valuation.go
│   │       ├── rating.go
│   │       ├── message.go
│   │       └── pagination.go
│   ├── database/
│   │   ├── postgres.go
│   │   └── migrations.go
│   ├── storage/
│   │   ├── local.go
│   │   └── s3.go
│   └── validator/
│       └── validator.go
├── pkg/
│   ├── response/
│   │   └── response.go
│   └── errors/
│       └── errors.go
├── uploads/
│   ├── avatars/
│   └── vehicles/
├── go.mod
├── go.sum
└── README.md
```

---

## 2. Configuration

### config/config.go

```go
package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Storage  StorageConfig
	RateLimit RateLimitConfig
}

type ServerConfig struct {
	Host string
	Port string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type JWTConfig struct {
	Secret     string
	Expiration time.Duration
}

type StorageConfig struct {
	Type       string // "local" or "s3"
	LocalPath  string
	BaseURL    string
	S3Bucket   string
	S3Region   string
	S3Key      string
	S3Secret   string
}

type RateLimitConfig struct {
	Requests int
	Duration time.Duration
}

func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Host: getEnv("SERVER_HOST", "0.0.0.0"),
			Port: getEnv("SERVER_PORT", "3000"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "password"),
			DBName:   getEnv("DB_NAME", "concesionaria"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "your-secret-key-change-in-production"),
			Expiration: getDurationEnv("JWT_EXPIRATION", 24*time.Hour*7),
		},
		Storage: StorageConfig{
			Type:      getEnv("STORAGE_TYPE", "local"),
			LocalPath: getEnv("STORAGE_LOCAL_PATH", "./uploads"),
			BaseURL:   getEnv("STORAGE_BASE_URL", "http://localhost:3000/uploads"),
		},
		RateLimit: RateLimitConfig{
			Requests: getIntEnv("RATE_LIMIT_REQUESTS", 100),
			Duration: getDurationEnv("RATE_LIMIT_DURATION", time.Minute),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
```

---

## 3. Domain Models

### internal/domain/models.go

```go
package domain

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	Name      string         `gorm:"not null" json:"name"`
	Phone     string         `json:"phone"`
	Avatar    string         `json:"avatar"`
	Bio       string         `json:"bio"`
	Role      string         `gorm:"default:user" json:"role"` // user, seller, admin
	IsActive  bool           `gorm:"default:true" json:"is_active"`
	Verified  bool           `gorm:"default:false" json:"verified"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Vehicles  []Vehicle      `gorm:"foreignKey:SellerID" json:"vehicles,omitempty"`
	Valuations []Valuation   `gorm:"foreignKey:UserID" json:"valuations,omitempty"`
	Favorites  []Favorite     `gorm:"foreignKey:UserID" json:"favorites,omitempty"`
	RatingsReceived []Rating `gorm:"foreignKey:TargetUserID" json:"ratings_received,omitempty"`
}

type Vehicle struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	SellerID      uint           `gorm:"not null;index" json:"seller_id"`
	Brand         string         `gorm:"not null;index" json:"brand"`
	Model         string         `gorm:"not null;index" json:"model"`
	Year          int            `gorm:"not null;index" json:"year"`
	Price         float64        `gorm:"not null;index" json:"price"`
	Mileage       int            `gorm:"not null;index" json:"mileage"`
	BodyType      string         `gorm:"index" json:"body_type"`
	FuelType      string         `gorm:"index" json:"fuel_type"`
	Color         string         `json:"color"`
	Transmission  string         `json:"transmission"`
	Engine        string         `json:"engine"`
	Horsepower    int            `json:"horsepower"`
	Description   string         `json:"description"`
	Status        string         `gorm:"default:pending;index" json:"status"` // pending, active, sold, deleted
	Featured      bool           `gorm:"default:false;index" json:"featured"`
	Verified      bool           `gorm:"default:false" json:"verified"`
	Views         int            `gorm:"default:0" json:"views"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
	
	Seller        User           `gorm:"foreignKey:SellerID" json:"seller,omitempty"`
	Images        []VehicleImage `gorm:"foreignKey:VehicleID" json:"images,omitempty"`
}

type VehicleImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	VehicleID uint      `gorm:"not null;index" json:"vehicle_id"`
	URL       string    `gorm:"not null" json:"url"`
	Position  int       `gorm:"default:0" json:"position"`
	CreatedAt time.Time `json:"created_at"`
}

type Valuation struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       uint      `gorm:"not null;index" json:"user_id"`
	Brand        string    `gorm:"not null" json:"brand"`
	Model        string    `gorm:"not null" json:"model"`
	Year         int       `gorm:"not null" json:"year"`
	Mileage      int       `gorm:"not null" json:"mileage"`
	FuelType     string    `json:"fuel_type"`
	Condition    string    `json:"condition"`
	EstimatedValue float64 `json:"estimated_value"`
	Status       string    `gorm:"default:pending" json:"status"` // pending, completed
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	
	User         User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

type Favorite struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;index" json:"user_id"`
	VehicleID uint      `gorm:"not null;index" json:"vehicle_id"`
	CreatedAt time.Time `json:"created_at"`
	
	User     User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Vehicle  Vehicle  `gorm:"foreignKey:VehicleID" json:"vehicle,omitempty"`
}

type Rating struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	RaterUserID   uint      `gorm:"not null;index" json:"rater_user_id"`
	TargetUserID  uint      `gorm:"not null;index" json:"target_user_id"`
	VehicleID     uint      `gorm:"index" json:"vehicle_id"`
	Score         int       `gorm:"not null" json:"score"` // 1-5
	Comment       string    `json:"comment"`
	TransactionID string    `json:"transaction_id"`
	CreatedAt     time.Time `json:"created_at"`
	
	RaterUser  User    `gorm:"foreignKey:RaterUserID" json:"rater_user,omitempty"`
	TargetUser User    `gorm:"foreignKey:TargetUserID" json:"target_user,omitempty"`
}

type Message struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	SenderID   uint      `gorm:"not null;index" json:"sender_id"`
	ReceiverID uint      `gorm:"not null;index" json:"receiver_id"`
	VehicleID  uint      `gorm:"index" json:"vehicle_id"`
	Content    string    `gorm:"not null" json:"content"`
	IsRead     bool      `gorm:"default:false;index" json:"is_read"`
	CreatedAt  time.Time `json:"created_at"`
	
	Sender   User    `gorm:"foreignKey:SenderID" json:"sender,omitempty"`
	Receiver User    `gorm:"foreignKey:ReceiverID" json:"receiver,omitempty"`
}

type Conversation struct {
	UserID        uint      `json:"user_id"`
	OtherUserID   uint      `json:"other_user_id"`
	OtherUserName string    `json:"other_user_name"`
	OtherAvatar   string    `json:"other_avatar"`
	VehicleID     uint      `json:"vehicle_id"`
	LastMessage   string    `json:"last_message"`
	LastMessageAt time.Time `json:"last_message_at"`
	UnreadCount   int       `json:"unread_count"`
}
```

---

## 4. Database Setup

### internal/database/postgres.go

```go
package database

import (
	"fmt"
	"log"
	"time"

	"concesionaria-web/config"
	"concesionaria-web/internal/domain"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPostgresConnection(cfg config.DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connection established")
	return db, nil
}
```

### internal/database/migrations.go

```go
package database

import (
	"log"

	"concesionaria-web/internal/domain"

	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	err := db.AutoMigrate(
		&domain.User{},
		&domain.Vehicle{},
		&domain.VehicleImage{},
		&domain.Valuation{},
		&domain.Favorite{},
		&domain.Rating{},
		&domain.Message{},
	)
	if err != nil {
		return err
	}
	
	log.Println("Migrations completed successfully")
	return nil
}
```

---

## 5. Request/Response DTOs

### internal/dto/request/auth.go

```go
package request

import "time"

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Name     string `json:"name" validate:"required,min=2,max=100"`
	Phone    string `json:"phone" validate:"omitempty,e164"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" validate:"required"`
	NewPassword     string `json:"new_password" validate:"required,min=8"`
}

type AuthResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	User      UserDTO   `json:"user"`
}
```

### internal/dto/request/user.go

```go
package request

type UpdateProfileRequest struct {
	Name  string `json:"name" validate:"omitempty,min=2,max=100"`
	Phone string `json:"phone" validate:"omitempty,e164"`
	Bio   string `json:"bio" validate:"omitempty,max=500"`
}

type UserProfileResponse struct {
	ID        uint   `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	Avatar    string `json:"avatar"`
	Bio       string `json:"bio"`
	Verified  bool   `json:"verified"`
	CreatedAt string `json:"created_at"`
}

type SellerProfileResponse struct {
	ID              uint    `json:"id"`
	Name            string  `json:"name"`
	Avatar          string  `json:"avatar"`
	Bio             string  `json:"bio"`
	Verified        bool    `json:"verified"`
	CreatedAt       string  `json:"created_at"`
	TotalListings   int     `json:"total_listings"`
	ActiveListings  int     `json:"active_listings"`
	AverageRating   float64 `json:"average_rating"`
	TotalRatings    int     `json:"total_ratings"`
}
```

### internal/dto/request/vehicle.go

```go
package request

type CreateVehicleRequest struct {
	Brand        string  `json:"brand" validate:"required,min=1,max=50"`
	Model        string  `json:"model" validate:"required,min=1,max=50"`
	Year         int     `json:"year" validate:"required,min=1900,max=2030"`
	Price        float64 `json:"price" validate:"required,gt=0"`
	Mileage      int     `json:"mileage" validate:"required,gte=0"`
	BodyType     string  `json:"body_type" validate:"omitempty,oneof=sedan suv coupe hatchback wagon pickup convertible van"`
	FuelType     string  `json:"fuel_type" validate:"omitempty,oneof=gasoline diesel electric hybrid flex"`
	Color        string  `json:"color" validate:"omitempty,max=30"`
	Transmission string  `json:"transmission" validate:"omitempty,oneof=automatic manual semi-auto"`
	Engine       string  `json:"engine" validate:"omitempty,max=50"`
	Horsepower   int     `json:"horsepower" validate:"omitempty,gte=0,lte=2000"`
	Description  string  `json:"description" validate:"omitempty,max=2000"`
}

type UpdateVehicleRequest struct {
	Brand        string  `json:"brand" validate:"omitempty,min=1,max=50"`
	Model        string  `json:"model" validate:"omitempty,min=1,max=50"`
	Year         int     `json:"year" validate:"omitempty,min=1900,max=2030"`
	Price        float64 `json:"price" validate:"omitempty,gt=0"`
	Mileage      int     `json:"mileage" validate:"omitempty,gte=0"`
	BodyType     string  `json:"body_type" validate:"omitempty,oneof=sedan suv coupe hatchback wagon pickup convertible van"`
	FuelType     string  `json:"fuel_type" validate:"omitempty,oneof=gasoline diesel electric hybrid flex"`
	Color        string  `json:"color" validate:"omitempty,max=30"`
	Transmission string  `json:"transmission" validate:"omitempty,oneof=automatic manual semi-auto"`
	Engine       string  `json:"engine" validate:"omitempty,max=50"`
	Horsepower   int     `json:"horsepower" validate:"omitempty,gte=0,lte=2000"`
	Description  string  `json:"description" validate:"omitempty,max=2000"`
	Status       string  `json:"status" validate:"omitempty,oneof=pending active sold deleted"`
}

type VehicleFilterRequest struct {
	Brand      string  `query:"brand"`
	Model      string  `query:"model"`
	MinPrice   float64 `query:"min_price"`
	MaxPrice   float64 `query:"max_price"`
	BodyType   string  `query:"body_type"`
	FuelType   string  `query:"fuel_type"`
	YearFrom   int     `query:"year_from"`
	YearTo     int     `query:"year_to"`
	MileageFrom int    `query:"mileage_from"`
	MileageTo  int     `query:"mileage_to"`
	Status     string  `query:"status"`
	Verified   bool    `query:"verified"`
	Featured   bool    `query:"featured"`
	Sort       string  `query:"sort"` // price_asc, price_desc, year_desc, year_asc, created_desc
	Page       int     `query:"page"`
	Limit      int     `query:"limit"`
}
```

### internal/dto/request/valuation.go

```go
package request

type CreateValuationRequest struct {
	Brand     string `json:"brand" validate:"required"`
	Model     string `json:"model" validate:"required"`
	Year      int    `json:"year" validate:"required,min=1900,max=2030"`
	Mileage   int    `json:"mileage" validate:"required,gte=0"`
	FuelType  string `json:"fuel_type" validate:"omitempty,oneof=gasoline diesel electric hybrid flex"`
	Condition string `json:"condition" validate:"required,oneof=excellent good fair poor"`
}
```

### internal/dto/request/rating.go

```go
package request

type CreateRatingRequest struct {
	TargetUserID  uint   `json:"target_user_id" validate:"required"`
	VehicleID     uint   `json:"vehicle_id" validate:"required"`
	TransactionID string `json:"transaction_id" validate:"omitempty"`
	Score         int    `json:"score" validate:"required,min=1,max=5"`
	Comment       string `json:"comment" validate:"omitempty,max=500"`
}
```

### internal/dto/request/message.go

```go
package request

type SendMessageRequest struct {
	ReceiverID uint   `json:"receiver_id" validate:"required"`
	VehicleID  uint   `json:"vehicle_id" validate:"omitempty"`
	Content    string `json:"content" validate:"required,min=1,max=1000"`
}
```

### internal/dto/response/response.go

```go
package response

import "time"

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
}

type ErrorInfo struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type PaginatedResponse struct {
	Items      interface{} `json:"items"`
	Total      int64       `json:"total"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	TotalPages int         `json:"total_pages"`
}

func SuccessResponse(data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Data:    data,
	}
}

func PaginatedSuccessResponse(items interface{}, total int64, page, limit int) APIResponse {
	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}
	return APIResponse{
		Success: true,
		Data: PaginatedResponse{
			Items:      items,
			Total:      total,
			Page:       page,
			Limit:      limit,
			TotalPages: totalPages,
		},
	}
}

func ErrorResponse(code, message string) APIResponse {
	return APIResponse{
		Success: false,
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
		},
	}
}
```

### internal/dto/response/vehicle.go

```go
package response

import "time"

type VehicleDTO struct {
	ID            uint          `json:"id"`
	SellerID      uint          `json:"seller_id"`
	Seller        SellerDTO     `json:"seller"`
	Brand         string        `json:"brand"`
	Model         string        `json:"model"`
	Year          int           `json:"year"`
	Price         float64       `json:"price"`
	Mileage       int           `json:"mileage"`
	BodyType      string        `json:"body_type"`
	FuelType      string        `json:"fuel_type"`
	Color         string        `json:"color"`
	Transmission  string        `json:"transmission"`
	Engine        string        `json:"engine"`
	Horsepower    int           `json:"horsepower"`
	Description   string        `json:"description"`
	Status        string        `json:"status"`
	Featured      bool          `json:"featured"`
	Verified      bool          `json:"verified"`
	Views         int           `json:"views"`
	Images        []ImageDTO    `json:"images"`
	CreatedAt     time.Time     `json:"created_at"`
}

type VehicleListDTO struct {
	ID           uint       `json:"id"`
	Brand        string     `json:"brand"`
	Model        string     `json:"model"`
	Year         int        `json:"year"`
	Price        float64    `json:"price"`
	Mileage      int        `json:"mileage"`
	BodyType     string     `json:"body_type"`
	FuelType     string     `json:"fuel_type"`
	ThumbnailURL string     `json:"thumbnail_url"`
	Status       string     `json:"status"`
	Featured     bool       `json:"featured"`
	Verified     bool       `json:"verified"`
	CreatedAt    time.Time  `json:"created_at"`
}

type SellerDTO struct {
	ID       uint   `json:"id"`
	Name     string `json:"name"`
	Avatar   string `json:"avatar"`
	Verified bool   `json:"verified"`
}

type ImageDTO struct {
	ID       uint   `json:"id"`
	URL      string `json:"url"`
	Position int    `json:"position"`
}
```

---

## 6. Repository Layer

### internal/repository/interfaces.go

```go
package repository

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/dto/request"
)

type UserRepository interface {
	Create(user *domain.User) error
	GetByID(id uint) (*domain.User, error)
	GetByEmail(email string) (*domain.User, error)
	Update(user *domain.User) error
	UpdateAvatar(userID uint, avatarURL string) error
}

type VehicleRepository interface {
	Create(vehicle *domain.Vehicle) error
	GetByID(id uint) (*domain.Vehicle, error)
	Update(vehicle *domain.Vehicle) error
	SoftDelete(id uint) error
	IncrementViews(id uint) error
	List(filter request.VehicleFilterRequest) ([]domain.Vehicle, int64, error)
	GetFeatured(limit int) ([]domain.Vehicle, error)
	GetBySellerID(sellerID uint) ([]domain.Vehicle, error)
	CreateImage(image *domain.VehicleImage) error
	DeleteImage(imageID uint) error
	GetImage(imageID uint) (*domain.VehicleImage, error)
}

type ValuationRepository interface {
	Create(valuation *domain.Valuation) error
	GetByID(id uint) (*domain.Valuation, error)
	GetByUserID(userID uint) ([]domain.Valuation, error)
}

type FavoriteRepository interface {
	Create(favorite *domain.Favorite) error
	Delete(userID, vehicleID uint) error
	GetByUserID(userID uint) ([]domain.Favorite, error)
	Exists(userID, vehicleID uint) (bool, error)
}

type RatingRepository interface {
	Create(rating *domain.Rating) error
	GetByUserID(userID uint) ([]domain.Rating, error)
	GetAverageRating(userID uint) (float64, int, error)
}

type MessageRepository interface {
	Create(message *domain.Message) error
	GetByID(id uint) (*domain.Message, error)
	GetConversation(userID1, userID2 uint, vehicleID *uint) ([]domain.Message, error)
	GetConversationsList(userID uint) ([]domain.Conversation, error)
	MarkAsRead(id uint) error
	MarkConversationAsRead(userID, otherUserID uint) error
	GetUnreadCount(userID uint) (int, error)
}
```

### internal/repository/user_repository.go

```go
package repository

import (
	"concesionaria-web/internal/domain"
	"errors"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetByID(id uint) (*domain.User, error) {
	var user domain.User
	err := r.db.First(&user, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &user, err
}

func (r *userRepository) GetByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &user, err
}

func (r *userRepository) Update(user *domain.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) UpdateAvatar(userID uint, avatarURL string) error {
	return r.db.Model(&domain.User{}).Where("id = ?", userID).Update("avatar", avatarURL).Error
}
```

### internal/repository/vehicle_repository.go

```go
package repository

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/dto/request"
	"errors"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type vehicleRepository struct {
	db *gorm.DB
}

func NewVehicleRepository(db *gorm.DB) VehicleRepository {
	return &vehicleRepository{db: db}
}

func (r *vehicleRepository) Create(vehicle *domain.Vehicle) error {
	return r.db.Create(vehicle).Error
}

func (r *vehicleRepository) GetByID(id uint) (*domain.Vehicle, error) {
	var vehicle domain.Vehicle
	err := r.db.Preload("Seller").Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("position ASC")
	}).First(&vehicle, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &vehicle, err
}

func (r *vehicleRepository) Update(vehicle *domain.Vehicle) error {
	return r.db.Save(vehicle).Error
}

func (r *vehicleRepository) SoftDelete(id uint) error {
	return r.db.Model(&domain.Vehicle{}).Where("id = ?", id).Update("status", "deleted").Error
}

func (r *vehicleRepository) IncrementViews(id uint) error {
	return r.db.Model(&domain.Vehicle{}).Where("id = ?", id).UpdateColumn("views", gorm.Expr("views + ?", 1)).Error
}

func (r *vehicleRepository) List(filter request.VehicleFilterRequest) ([]domain.Vehicle, int64, error) {
	var vehicles []domain.Vehicle
	var total int64

	query := r.db.Model(&domain.Vehicle{}).Where("status != ?", "deleted")

	if filter.Brand != "" {
		query = query.Where("brand ILIKE ?", "%"+filter.Brand+"%")
	}
	if filter.Model != "" {
		query = query.Where("model ILIKE ?", "%"+filter.Model+"%")
	}
	if filter.MinPrice > 0 {
		query = query.Where("price >= ?", filter.MinPrice)
	}
	if filter.MaxPrice > 0 {
		query = query.Where("price <= ?", filter.MaxPrice)
	}
	if filter.BodyType != "" {
		query = query.Where("body_type = ?", filter.BodyType)
	}
	if filter.FuelType != "" {
		query = query.Where("fuel_type = ?", filter.FuelType)
	}
	if filter.YearFrom > 0 {
		query = query.Where("year >= ?", filter.YearFrom)
	}
	if filter.YearTo > 0 {
		query = query.Where("year <= ?", filter.YearTo)
	}
	if filter.MileageFrom > 0 {
		query = query.Where("mileage >= ?", filter.MileageFrom)
	}
	if filter.MileageTo > 0 {
		query = query.Where("mileage <= ?", filter.MileageTo)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}
	if filter.Verified {
		query = query.Where("verified = ?", true)
	}

	query.Count(&total)

	switch filter.Sort {
	case "price_asc":
		query = query.Order("price ASC")
	case "price_desc":
		query = query.Order("price DESC")
	case "year_desc":
		query = query.Order("year DESC")
	case "year_asc":
		query = query.Order("year ASC")
	case "created_desc":
		query = query.Order("created_at DESC")
	default:
		query = query.Order("created_at DESC")
	}

	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}

	offset := (filter.Page - 1) * filter.Limit

	err := query.Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("position ASC").Limit(1)
	}).Offset(offset).Limit(filter.Limit).Find(&vehicles).Error

	return vehicles, total, err
}

func (r *vehicleRepository) GetFeatured(limit int) ([]domain.Vehicle, error) {
	var vehicles []domain.Vehicle
	err := r.db.Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("position ASC").Limit(1)
	}).Where("featured = ? AND status = ?", true, "active").Order("created_at DESC").Limit(limit).Find(&vehicles).Error
	return vehicles, err
}

func (r *vehicleRepository) GetBySellerID(sellerID uint) ([]domain.Vehicle, error) {
	var vehicles []domain.Vehicle
	err := r.db.Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("position ASC").Limit(1)
	}).Where("seller_id = ? AND status != ?", sellerID, "deleted").Order("created_at DESC").Find(&vehicles).Error
	return vehicles, err
}

func (r *vehicleRepository) CreateImage(image *domain.VehicleImage) error {
	return r.db.Create(image).Error
}

func (r *vehicleRepository) DeleteImage(imageID uint) error {
	return r.db.Delete(&domain.VehicleImage{}, imageID).Error
}

func (r *vehicleRepository) GetImage(imageID uint) (*domain.VehicleImage, error) {
	var image domain.VehicleImage
	err := r.db.First(&image, imageID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &image, err
}
```

---

## 7. Service Layer

### internal/service/auth_service.go

```go
package service

import (
	"errors"
	"time"

	"concesionaria-web/config"
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/dto/request"
	"concesionaria-web/internal/repository"
	"concesionaria-web/pkg/errors"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrEmailExists        = errors.New("email already exists")
	ErrUserNotFound       = errors.New("user not found")
	ErrInvalidToken       = errors.New("invalid token")
)

type AuthService struct {
	userRepo  repository.UserRepository
	jwtConfig config.JWTConfig
}

func NewAuthService(userRepo repository.UserRepository, jwtConfig config.JWTConfig) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		jwtConfig: jwtConfig,
	}
}

func (s *AuthService) Register(req request.RegisterRequest) (*request.AuthResponse, error) {
	existingUser, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, ErrEmailExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		Email:    req.Email,
		Password: string(hashedPassword),
		Name:     req.Name,
		Role:     "user",
		IsActive: true,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return s.generateAuthResponse(user)
}

func (s *AuthService) Login(req request.LoginRequest) (*request.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return s.generateAuthResponse(user)
}

func (s *AuthService) generateAuthResponse(user *domain.User) (*request.AuthResponse, error) {
	expiresAt := time.Now().Add(s.jwtConfig.Expiration)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     expiresAt.Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.jwtConfig.Secret))
	if err != nil {
		return nil, err
	}

	return &request.AuthResponse{
		Token:     tokenString,
		ExpiresAt: expiresAt,
		User: request.UserDTO{
			ID:        user.ID,
			Email:     user.Email,
			Name:      user.Name,
			Avatar:    user.Avatar,
			Role:      user.Role,
			Verified:  user.Verified,
			CreatedAt: user.CreatedAt.Format(time.RFC3339),
		},
	}, nil
}

func (s *AuthService) ValidateToken(tokenString string) (*JWTClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, ErrInvalidToken
		}
		return []byte(s.jwtConfig.Secret), nil
	})

	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, ErrInvalidToken
	}

	return &JWTClaims{
		UserID: uint(claims["user_id"].(float64)),
		Email:  claims["email"].(string),
		Role:   claims["role"].(string),
	}, nil
}

type JWTClaims struct {
	UserID uint
	Email  string
	Role   string
}
```

### internal/service/vehicle_service.go

```go
package service

import (
	"errors"

	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/dto/request"
	"concesionaria-web/internal/repository"
	"concesionaria-web/internal/storage"
)

var (
	ErrVehicleNotFound    = errors.New("vehicle not found")
	ErrUnauthorized       = errors.New("unauthorized action")
	ErrImageNotFound       = errors.New("image not found")
	ErrMaxImagesExceeded   = errors.New("maximum images limit exceeded")
)

const MaxVehicleImages = 10

type VehicleService struct {
	vehicleRepo repository.VehicleRepository
	userRepo    repository.UserRepository
	storage     storage.Storage
}

func NewVehicleService(
	vehicleRepo repository.VehicleRepository,
	userRepo repository.UserRepository,
	storage storage.Storage,
) *VehicleService {
	return &VehicleService{
		vehicleRepo: vehicleRepo,
		userRepo:    userRepo,
		storage:     storage,
	}
}

func (s *VehicleService) Create(userID uint, req request.CreateVehicleRequest) (*domain.Vehicle, error) {
	vehicle := &domain.Vehicle{
		SellerID:    userID,
		Brand:       req.Brand,
		Model:       req.Model,
		Year:        req.Year,
		Price:       req.Price,
		Mileage:     req.Mileage,
		BodyType:    req.BodyType,
		FuelType:    req.FuelType,
		Color:       req.Color,
		Transmission: req.Transmission,
		Engine:      req.Engine,
		Horsepower:  req.Horsepower,
		Description: req.Description,
		Status:      "pending",
	}

	if err := s.vehicleRepo.Create(vehicle); err != nil {
		return nil, err
	}

	return vehicle, nil
}

func (s *VehicleService) GetByID(id uint) (*domain.Vehicle, error) {
	vehicle, err := s.vehicleRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if vehicle == nil || vehicle.Status == "deleted" {
		return nil, ErrVehicleNotFound
	}
	
	s.vehicleRepo.IncrementViews(id)
	
	return vehicle, nil
}

func (s *VehicleService) Update(userID uint, vehicleID uint, req request.UpdateVehicleRequest) (*domain.Vehicle, error) {
	vehicle, err := s.vehicleRepo.GetByID(vehicleID)
	if err != nil {
		return nil, err
	}
	if vehicle == nil {
		return nil, ErrVehicleNotFound
	}
	if vehicle.SellerID != userID {
		return nil, ErrUnauthorized
	}

	updates := map[string]interface{}{}
	if req.Brand != "" {
		updates["brand"] = req.Brand
	}
	if req.Model != "" {
		updates["model"] = req.Model
	}
	if req.Year > 0 {
		updates["year"] = req.Year
	}
	if req.Price > 0 {
		updates["price"] = req.Price
	}
	if req.Mileage >= 0 {
		updates["mileage"] = req.Mileage
	}
	if req.BodyType != "" {
		updates["body_type"] = req.BodyType
	}
	if req.FuelType != "" {
		updates["fuel_type"] = req.FuelType
	}
	if req.Color != "" {
		updates["color"] = req.Color
	}
	if req.Transmission != "" {
		updates["transmission"] = req.Transmission
	}
	if req.Engine != "" {
		updates["engine"] = req.Engine
	}
	if req.Horsepower >= 0 {
		updates["horsepower"] = req.Horsepower
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}

	if len(updates) > 0 {
		err = s.vehicleRepo.Update(updates)
		if err != nil {
			return nil, err
		}
	}

	return s.vehicleRepo.GetByID(vehicleID)
}

func (s *VehicleService) Delete(userID, vehicleID uint) error {
	vehicle, err := s.vehicleRepo.GetByID(vehicleID)
	if err != nil {
		return err
	}
	if vehicle == nil {
		return ErrVehicleNotFound
	}
	if vehicle.SellerID != userID {
		return ErrUnauthorized
	}

	return s.vehicleRepo.SoftDelete(vehicleID)
}

func (s *VehicleService) List(filter request.VehicleFilterRequest) ([]domain.Vehicle, int64, error) {
	filter.Status = "active"
	return s.vehicleRepo.List(filter)
}

func (s *VehicleService) GetFeatured(limit int) ([]domain.Vehicle, error) {
	return s.vehicleRepo.GetFeatured(limit)
}

func (s *VehicleService) GetBySellerID(sellerID uint) ([]domain.Vehicle, error) {
	return s.vehicleRepo.GetBySellerID(sellerID)
}

func (s *VehicleService) AddImage(vehicleID uint, file interface{}, position int) (*domain.VehicleImage, error) {
	vehicle, err := s.vehicleRepo.GetByID(vehicleID)
	if err != nil {
		return nil, err
	}
	if vehicle == nil {
		return nil, ErrVehicleNotFound
	}

	if len(vehicle.Images) >= MaxVehicleImages {
		return nil, ErrMaxImagesExceeded
	}

	url, err := s.storage.UploadFile(file, "vehicles", vehicleID)
	if err != nil {
		return nil, err
	}

	image := &domain.VehicleImage{
		VehicleID: vehicleID,
		URL:       url,
		Position:  position,
	}

	if err := s.vehicleRepo.CreateImage(image); err != nil {
		s.storage.DeleteFile(url)
		return nil, err
	}

	return image, nil
}

func (s *VehicleService) DeleteImage(userID, vehicleID, imageID uint) error {
	vehicle, err := s.vehicleRepo.GetByID(vehicleID)
	if err != nil {
		return err
	}
	if vehicle == nil {
		return ErrVehicleNotFound
	}
	if vehicle.SellerID != userID {
		return ErrUnauthorized
	}

	image, err := s.vehicleRepo.GetImage(imageID)
	if err != nil {
		return err
	}
	if image == nil || image.VehicleID != vehicleID {
		return ErrImageNotFound
	}

	if err := s.vehicleRepo.DeleteImage(imageID); err != nil {
		return err
	}

	s.storage.DeleteFile(image.URL)
	return nil
}
```

---

## 8. Middleware

### internal/middleware/auth.go

```go
package middleware

import (
	"strings"

	"concesionaria-web/internal/service"
	"concesionaria-web/pkg/response"

	"github.com/gofiber/fiber/v2"
)

func Auth(authService *service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(
				response.ErrorResponse("UNAUTHORIZED", "Missing authorization header"),
			)
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(
				response.ErrorResponse("UNAUTHORIZED", "Invalid authorization format"),
			)
		}

		claims, err := authService.ValidateToken(parts[1])
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(
				response.ErrorResponse("UNAUTHORIZED", "Invalid or expired token"),
			)
		}

		c.Locals("userID", claims.UserID)
		c.Locals("userEmail", claims.Email)
		c.Locals("userRole", claims.Role)

		return c.Next()
	}
}

func RequireRole(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole := c.Locals("userRole").(string)
		for _, role := range roles {
			if userRole == role {
				return c.Next()
			}
		}
		return c.Status(fiber.StatusForbidden).JSON(
			response.ErrorResponse("FORBIDDEN", "Insufficient permissions"),
		)
	}
}
```

### internal/middleware/cors.go

```go
package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CORS() fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		ExposeHeaders:    "Content-Length,Content-Type",
		AllowCredentials: true,
	})
}
```

### internal/middleware/ratelimit.go

```go
package middleware

import (
	"time"

	"concesionaria-web/config"
	"concesionaria-web/pkg/response"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

func RateLimit(cfg config.RateLimitConfig) fiber.Handler {
	return limiter.New(limiter.Config{
		Max:        cfg.Requests,
		Expiration: cfg.Duration,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(
				response.ErrorResponse("RATE_LIMIT_EXCEEDED", "Too many requests. Please try again later."),
			)
		},
	})
}
```

### internal/middleware/logger.go

```go
package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		
		err := c.Next()
		
		log.Printf(
			"%s %s %d %s",
			c.Method(),
			c.Path(),
			c.Response().StatusCode(),
			time.Since(start),
		)
		
		return err
	}
}
```

---

## 9. Storage Interface

### internal/storage/local.go

```go
package storage

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"
)

type LocalStorage struct {
	basePath string
	baseURL  string
}

func NewLocalStorage(basePath, baseURL string) *LocalStorage {
	os.MkdirAll(basePath, 0755)
	return &LocalStorage{
		basePath: basePath,
		baseURL:  baseURL,
	}
}

func (s *LocalStorage) UploadFile(file interface{}, category string, id uint) (string, error) {
	src, ok := file.(io.Reader)
	if !ok {
		return "", fmt.Errorf("invalid file type")
	}

	filename := fmt.Sprintf("%d_%d%s", id, time.Now().UnixNano(), ".jpg")
	dir := filepath.Join(s.basePath, category, fmt.Sprintf("%d", id))
	os.MkdirAll(dir, 0755)

	dstPath := filepath.Join(dir, filename)
	dst, err := os.Create(dstPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return "", err
	}

	return fmt.Sprintf("%s/%s/%s", s.baseURL, category, filename), nil
}

func (s *LocalStorage) DeleteFile(url string) error {
	filename := filepath.Base(url)
	parts := []string{s.basePath}
	for _, part := range []string{category, id, filename} {
		if part != "" {
			parts = append(parts, part)
		}
	}
	path := filepath.Join(parts...)
	return os.Remove(path)
}
```

### internal/storage/s3.go (Migration Path)

```go
package storage

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Storage struct {
	client   *s3.Client
	bucket   string
	baseURL  string
}

func NewS3Storage(bucket, region, key, secret, baseURL string) (*S3Storage, error) {
	cfg, err := config.LoadDefaultConfig(context.Background(),
		config.WithRegion(region),
		config.WithCredentialsProvider(
			aws.NewStaticCredentialsProvider(key, secret, ""),
		),
	)
	if err != nil {
		return nil, err
	}

	return &S3Storage{
		client:  s3.NewFromConfig(cfg),
		bucket:  bucket,
		baseURL: baseURL,
	}, nil
}

func (s *S3Storage) UploadFile(file interface{}, category string, id uint) (string, error) {
	src, ok := file.(io.Reader)
	if !ok {
		return "", fmt.Errorf("invalid file type")
	}

	key := fmt.Sprintf("%s/%d/%d.jpg", category, id, time.Now().UnixNano())

	_, err := s.client.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
		Body:   src,
	})
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s/%s", s.baseURL, key), nil
}

func (s *S3Storage) DeleteFile(url string) error {
	key := extractS3Key(url, s.bucket)
	_, err := s.client.DeleteObject(context.Background(), &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(key),
	})
	return err
}
```

---

## 10. Handlers

### internal/handler/auth_handler.go

```go
package handler

import (
	"concesionaria-web/internal/dto/request"
	"concesionaria-web/internal/repository"
	"concesionaria-web/internal/service"
	"concesionaria-web/pkg/response"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	authService *service.AuthService
	userRepo    repository.UserRepository
	validator   *validator.Validate
}

func NewAuthHandler(authService *service.AuthService, userRepo repository.UserRepository) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		userRepo:    userRepo,
		validator:   validator.New(),
	}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req request.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_REQUEST", "Invalid request body"),
		)
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("VALIDATION_ERROR", formatValidationError(err)),
		)
	}

	authResp, err := h.authService.Register(req)
	if err != nil {
		if err == service.ErrEmailExists {
			return c.Status(fiber.StatusConflict).JSON(
				response.ErrorResponse("EMAIL_EXISTS", "Email already registered"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to register user"),
		)
	}

	return c.Status(fiber.StatusCreated).JSON(response.SuccessResponse(authResp))
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req request.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_REQUEST", "Invalid request body"),
		)
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("VALIDATION_ERROR", formatValidationError(err)),
		)
	}

	authResp, err := h.authService.Login(req)
	if err != nil {
		if err == service.ErrInvalidCredentials {
			return c.Status(fiber.StatusUnauthorized).JSON(
				response.ErrorResponse("INVALID_CREDENTIALS", "Invalid email or password"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to login"),
		)
	}

	return c.JSON(response.SuccessResponse(authResp))
}

func (h *AuthHandler) Me(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	user, err := h.userRepo.GetByID(userID)
	if err != nil || user == nil {
		return c.Status(fiber.StatusNotFound).JSON(
			response.ErrorResponse("USER_NOT_FOUND", "User not found"),
		)
	}

	return c.JSON(response.SuccessResponse(request.UserDTO{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Phone:     user.Phone,
		Avatar:    user.Avatar,
		Bio:       user.Bio,
		Role:      user.Role,
		Verified:  user.Verified,
		CreatedAt: user.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}))
}

func (h *AuthHandler) ChangePassword(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req request.ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_REQUEST", "Invalid request body"),
		)
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("VALIDATION_ERROR", formatValidationError(err)),
		)
	}

	user, err := h.userRepo.GetByID(userID)
	if err != nil || user == nil {
		return c.Status(fiber.StatusNotFound).JSON(
			response.ErrorResponse("USER_NOT_FOUND", "User not found"),
		)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(
			response.ErrorResponse("INVALID_PASSWORD", "Current password is incorrect"),
		)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to update password"),
		)
	}

	user.Password = string(hashedPassword)
	if err := h.userRepo.Update(user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to update password"),
		)
	}

	return c.JSON(response.SuccessResponse(fiber.Map{"message": "Password updated successfully"}))
}
```

### internal/handler/vehicle_handler.go

```go
package handler

import (
	"strconv"

	"concesionaria-web/internal/dto/request"
	"concesionaria-web/internal/service"
	"concesionaria-web/pkg/response"

	"github.com/gofiber/fiber/v2"
)

type VehicleHandler struct {
	vehicleService *service.VehicleService
	validator      *validator.Validate
}

func NewVehicleHandler(vehicleService *service.VehicleService) *VehicleHandler {
	return &VehicleHandler{
		vehicleService: vehicleService,
		validator:      validator.New(),
	}
}

func (h *VehicleHandler) List(c *fiber.Ctx) error {
	filter := request.VehicleFilterRequest{
		Brand:      c.Query("brand"),
		Model:      c.Query("model"),
		MinPrice:   toFloat64(c.Query("min_price")),
		MaxPrice:   toFloat64(c.Query("max_price")),
		BodyType:   c.Query("body_type"),
		FuelType:   c.Query("fuel_type"),
		YearFrom:   toInt(c.Query("year_from")),
		YearTo:     toInt(c.Query("year_to")),
		MileageFrom: toInt(c.Query("mileage_from")),
		MileageTo:  toInt(c.Query("mileage_to")),
		Status:     c.Query("status"),
		Verified:   c.QueryBool("verified", false),
		Featured:   c.QueryBool("featured", false),
		Sort:       c.Query("sort", "created_desc"),
		Page:       toInt(c.Query("page", "1")),
		Limit:      toInt(c.Query("limit", "20")),
	}

	vehicles, total, err := h.vehicleService.List(filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to fetch vehicles"),
		)
	}

	return c.JSON(response.PaginatedSuccessResponse(vehicles, total, filter.Page, filter.Limit))
}

func (h *VehicleHandler) GetFeatured(c *fiber.Ctx) error {
	limit := toInt(c.Query("limit", "10"))
	vehicles, err := h.vehicleService.GetFeatured(limit)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to fetch featured vehicles"),
		)
	}

	return c.JSON(response.SuccessResponse(vehicles))
}

func (h *VehicleHandler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_ID", "Invalid vehicle ID"),
		)
	}

	vehicle, err := h.vehicleService.GetByID(uint(id))
	if err != nil {
		if err == service.ErrVehicleNotFound {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("NOT_FOUND", "Vehicle not found"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to fetch vehicle"),
		)
	}

	return c.JSON(response.SuccessResponse(vehicle))
}

func (h *VehicleHandler) Create(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var req request.CreateVehicleRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_REQUEST", "Invalid request body"),
		)
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("VALIDATION_ERROR", formatValidationError(err)),
		)
	}

	vehicle, err := h.vehicleService.Create(userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to create vehicle"),
		)
	}

	return c.Status(fiber.StatusCreated).JSON(response.SuccessResponse(vehicle))
}

func (h *VehicleHandler) Update(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	vehicleID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_ID", "Invalid vehicle ID"),
		)
	}

	var req request.UpdateVehicleRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_REQUEST", "Invalid request body"),
		)
	}

	if err := h.validator.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("VALIDATION_ERROR", formatValidationError(err)),
		)
	}

	vehicle, err := h.vehicleService.Update(userID, uint(vehicleID), req)
	if err != nil {
		if err == service.ErrVehicleNotFound {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("NOT_FOUND", "Vehicle not found"),
			)
		}
		if err == service.ErrUnauthorized {
			return c.Status(fiber.StatusForbidden).JSON(
				response.ErrorResponse("FORBIDDEN", "You can only update your own vehicles"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to update vehicle"),
		)
	}

	return c.JSON(response.SuccessResponse(vehicle))
}

func (h *VehicleHandler) Delete(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	vehicleID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_ID", "Invalid vehicle ID"),
		)
	}

	err = h.vehicleService.Delete(userID, uint(vehicleID))
	if err != nil {
		if err == service.ErrVehicleNotFound {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("NOT_FOUND", "Vehicle not found"),
			)
		}
		if err == service.ErrUnauthorized {
			return c.Status(fiber.StatusForbidden).JSON(
				response.ErrorResponse("FORBIDDEN", "You can only delete your own vehicles"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to delete vehicle"),
		)
	}

	return c.JSON(response.SuccessResponse(fiber.Map{"message": "Vehicle deleted successfully"}))
}

func (h *VehicleHandler) UploadImages(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	vehicleID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_ID", "Invalid vehicle ID"),
		)
	}

	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_FILE", "No image file provided"),
		)
	}

	src, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to process image"),
		)
	}
	defer src.Close()

	position := toInt(c.FormValue("position", "0"))

	image, err := h.vehicleService.AddImage(uint(vehicleID), src, position)
	if err != nil {
		if err == service.ErrVehicleNotFound {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("NOT_FOUND", "Vehicle not found"),
			)
		}
		if err == service.ErrMaxImagesExceeded {
			return c.Status(fiber.StatusBadRequest).JSON(
				response.ErrorResponse("MAX_IMAGES", "Maximum number of images exceeded"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to upload image"),
		)
	}

	return c.Status(fiber.StatusCreated).JSON(response.SuccessResponse(image))
}

func (h *VehicleHandler) DeleteImage(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)
	vehicleID, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_ID", "Invalid vehicle ID"),
		)
	}
	imageID, err := strconv.ParseUint(c.Params("imageId"), 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			response.ErrorResponse("INVALID_ID", "Invalid image ID"),
		)
	}

	err = h.vehicleService.DeleteImage(userID, uint(vehicleID), uint(imageID))
	if err != nil {
		if err == service.ErrVehicleNotFound {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("NOT_FOUND", "Vehicle not found"),
			)
		}
		if err == service.ErrImageNotFound {
			return c.Status(fiber.StatusNotFound).JSON(
				response.ErrorResponse("NOT_FOUND", "Image not found"),
			)
		}
		if err == service.ErrUnauthorized {
			return c.Status(fiber.StatusForbidden).JSON(
				response.ErrorResponse("FORBIDDEN", "You can only delete images of your own vehicles"),
			)
		}
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to delete image"),
		)
	}

	return c.JSON(response.SuccessResponse(fiber.Map{"message": "Image deleted successfully"}))
}

func toFloat64(s string) float64 {
	f, _ := strconv.ParseFloat(s, 64)
	return f
}

func toInt(s string) int {
	i, _ := strconv.Atoi(s)
	return i
}
```

---

## 11. Routes Setup

### cmd/server/main.go

```go
package main

import (
	"fmt"
	"log"

	"concesionaria-web/config"
	"concesionaria-web/internal/database"
	"concesionaria-web/internal/handler"
	"concesionaria-web/internal/middleware"
	"concesionaria-web/internal/repository"
	"concesionaria-web/internal/service"
	"concesionaria-web/internal/storage"

	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.Load()

	db, err := database.NewPostgresConnection(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	var fileStorage storage.Storage
	if cfg.Storage.Type == "s3" {
		fileStorage, err = storage.NewS3Storage(
			cfg.Storage.S3Bucket,
			cfg.Storage.S3Region,
			cfg.Storage.S3Key,
			cfg.Storage.S3Secret,
			cfg.Storage.BaseURL,
		)
	} else {
		fileStorage = storage.NewLocalStorage(cfg.Storage.LocalPath, cfg.Storage.BaseURL)
	}

	userRepo := repository.NewUserRepository(db)
	vehicleRepo := repository.NewVehicleRepository(db)
	valuationRepo := repository.NewValuationRepository(db)
	favoriteRepo := repository.NewFavoriteRepository(db)
	ratingRepo := repository.NewRatingRepository(db)
	messageRepo := repository.NewMessageRepository(db)

	authService := service.NewAuthService(userRepo, cfg.JWT)
	userService := service.NewUserService(userRepo)
	vehicleService := service.NewVehicleService(vehicleRepo, userRepo, fileStorage)
	valuationService := service.NewValuationService(valuationRepo)
	favoriteService := service.NewFavoriteService(favoriteRepo, vehicleRepo)
	ratingService := service.NewRatingService(ratingRepo)
	messageService := service.NewMessageService(messageRepo)

	authHandler := handler.NewAuthHandler(authService, userRepo)
	userHandler := handler.NewUserHandler(userService, ratingRepo)
	vehicleHandler := handler.NewVehicleHandler(vehicleService)
	valuationHandler := handler.NewValuationHandler(valuationService)
	favoriteHandler := handler.NewFavoriteHandler(favoriteService)
	ratingHandler := handler.NewRatingHandler(ratingService)
	messageHandler := handler.NewMessageHandler(messageService)
	dashboardHandler := handler.NewDashboardHandler(vehicleService, valuationService, ratingRepo, messageRepo)

	app := fiber.New(fiber.Config{
		ErrorHandler: customErrorHandler,
	})

	app.Use(middleware.Logger())
	app.Use(middleware.CORS())
	app.Use(middleware.RateLimit(cfg.RateLimit))

	app.Static("/uploads", cfg.Storage.LocalPath)

	setupRoutes(app, authHandler, userHandler, vehicleHandler, valuationHandler, favoriteHandler, ratingHandler, messageHandler, dashboardHandler, authService)

	addr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Server starting on %s", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(
	app *fiber.App,
	authHandler *handler.AuthHandler,
	userHandler *handler.UserHandler,
	vehicleHandler *handler.VehicleHandler,
	valuationHandler *handler.ValuationHandler,
	favoriteHandler *handler.FavoriteHandler,
	ratingHandler *handler.RatingHandler,
	messageHandler *handler.MessageHandler,
	dashboardHandler *handler.DashboardHandler,
	authService *service.AuthService,
) {
	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/me", middleware.Auth(authService), authHandler.Me)
	auth.Put("/password", middleware.Auth(authService), authHandler.ChangePassword)

	users := api.Group("/users")
	users.Get("/:id", userHandler.GetProfile)
	users.Get("/:id/vehicles", userHandler.GetUserVehicles)
	users.Get("/:id/ratings", userHandler.GetUserRatings)
	users.Put("/profile", middleware.Auth(authService), userHandler.UpdateProfile)
	users.Post("/avatar", middleware.Auth(authService), userHandler.UploadAvatar)

	vehicles := api.Group("/vehicles")
	vehicles.Get("/", vehicleHandler.List)
	vehicles.Get("/featured", vehicleHandler.GetFeatured)
	vehicles.Get("/:id", vehicleHandler.GetByID)
	vehicles.Post("/", middleware.Auth(authService), vehicleHandler.Create)
	vehicles.Put("/:id", middleware.Auth(authService), vehicleHandler.Update)
	vehicles.Delete("/:id", middleware.Auth(authService), vehicleHandler.Delete)
	vehicles.Post("/:id/images", middleware.Auth(authService), vehicleHandler.UploadImages)
	vehicles.Delete("/:id/images/:imageId", middleware.Auth(authService), vehicleHandler.DeleteImage)

	valuations := api.Group("/valuations")
	valuations.Post("/", middleware.Auth(authService), valuationHandler.Create)
	valuations.Get("/", middleware.Auth(authService), valuationHandler.List)
	valuations.Get("/:id", middleware.Auth(authService), valuationHandler.GetByID)

	favorites := api.Group("/favorites")
	favorites.Get("/", middleware.Auth(authService), favoriteHandler.List)
	favorites.Post("/:vehicleId", middleware.Auth(authService), favoriteHandler.Add)
	favorites.Delete("/:vehicleId", middleware.Auth(authService), favoriteHandler.Remove)

	ratings := api.Group("/ratings")
	ratings.Post("/", middleware.Auth(authService), ratingHandler.Create)
	ratings.Get("/user/:userId", ratingHandler.GetByUserID)

	messages := api.Group("/messages")
	messages.Get("/", middleware.Auth(authService), messageHandler.ListConversations)
	messages.Get("/:userId", middleware.Auth(authService), messageHandler.GetConversation)
	messages.Post("/", middleware.Auth(authService), messageHandler.Send)
	messages.Put("/:id/read", middleware.Auth(authService), messageHandler.MarkAsRead)

	dashboard := api.Group("/dashboard", middleware.Auth(authService))
	dashboard.Get("/stats", dashboardHandler.GetStats)
	dashboard.Get("/vehicles", dashboardHandler.GetVehicles)
	dashboard.Get("/valuations", dashboardHandler.GetValuations)
}

func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"error": fiber.Map{
			"code":    "INTERNAL_ERROR",
			"message": err.Error(),
		},
	})
}
```

---

## 12. Error Handling Package

### pkg/errors/errors.go

```go
package errors

import (
	"errors"
	"strings"
)

func FormatValidationErrors(err error) string {
	var sb strings.Builder
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			field := strings.ToLower(e.Field())
			switch e.Tag() {
			case "required":
				sb.WriteString(field + " is required; ")
			case "email":
				sb.WriteString(field + " must be a valid email; ")
			case "min":
				sb.WriteString(field + " is too short; ")
			case "max":
				sb.WriteString(field + " is too long; ")
			case "gt":
				sb.WriteString(field + " must be greater than " + e.Param() + "; ")
			case "gte":
				sb.WriteString(field + " must be greater than or equal to " + e.Param() + "; ")
			case "lte":
				sb.WriteString(field + " must be less than or equal to " + e.Param() + "; ")
			case "oneof":
				sb.WriteString(field + " must be one of: " + e.Param() + "; ")
			default:
				sb.WriteString(field + " is invalid; ")
			}
		}
		return strings.TrimSuffix(sb.String(), "; ")
	}
	return err.Error()
}

var (
	ErrNotFound          = errors.New("resource not found")
	ErrUnauthorized      = errors.New("unauthorized")
	ErrForbidden         = errors.New("forbidden")
	ErrConflict          = errors.New("resource already exists")
	ErrValidation        = errors.New("validation error")
	ErrInternalServer    = errors.New("internal server error")
)
```

---

## 13. Dashboard Handler

### internal/handler/dashboard_handler.go

```go
package handler

import (
	"concesionaria-web/internal/service"
	"concesionaria-web/pkg/response"

	"github.com/gofiber/fiber/v2"
)

type DashboardHandler struct {
	vehicleService *service.VehicleService
	valuationService *service.ValuationService
	ratingRepo    repository.RatingRepository
	messageRepo   repository.MessageRepository
}

func NewDashboardHandler(
	vehicleService *service.VehicleService,
	valuationService *service.ValuationService,
	ratingRepo repository.RatingRepository,
	messageRepo repository.MessageRepository,
) *DashboardHandler {
	return &DashboardHandler{
		vehicleService:   vehicleService,
		valuationService: valuationService,
		ratingRepo:       ratingRepo,
		messageRepo:      messageRepo,
	}
}

func (h *DashboardHandler) GetStats(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	vehicles, err := h.vehicleService.GetBySellerID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to fetch dashboard stats"),
		)
	}

	activeListings := 0
	soldVehicles := 0
	totalViews := 0
	for _, v := range vehicles {
		if v.Status == "active" {
			activeListings++
		}
		if v.Status == "sold" {
			soldVehicles++
		}
		totalViews += v.Views
	}

	avgRating, totalRatings, _ := h.ratingRepo.GetAverageRating(userID)
	unreadMessages, _ := h.messageRepo.GetUnreadCount(userID)

	return c.JSON(response.SuccessResponse(fiber.Map{
		"total_listings":   len(vehicles),
		"active_listings":  activeListings,
		"sold_vehicles":    soldVehicles,
		"total_views":      totalViews,
		"average_rating":   avgRating,
		"total_ratings":    totalRatings,
		"unread_messages":  unreadMessages,
	}))
}

func (h *DashboardHandler) GetVehicles(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	vehicles, err := h.vehicleService.GetBySellerID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to fetch vehicles"),
		)
	}

	return c.JSON(response.SuccessResponse(vehicles))
}

func (h *DashboardHandler) GetValuations(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	valuations, err := h.valuationService.GetByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(
			response.ErrorResponse("INTERNAL_ERROR", "Failed to fetch valuations"),
		)
	}

	return c.JSON(response.SuccessResponse(valuations))
}
```

---

## 14. Additional Services

### internal/service/user_service.go

```go
package service

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/dto/request"
	"concesionaria-web/internal/repository"
)

type UserService struct {
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (s *UserService) GetProfile(id uint) (*domain.User, error) {
	return s.userRepo.GetByID(id)
}

func (s *UserService) UpdateProfile(userID uint, req request.UpdateProfileRequest) (*domain.User, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil || user == nil {
		return nil, ErrUserNotFound
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

	if err := s.userRepo.Update(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) UpdateAvatar(userID uint, avatarURL string) error {
	return s.userRepo.UpdateAvatar(userID, avatarURL)
}
```

### internal/service/favorite_service.go

```go
package service

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/repository"
)

type FavoriteService struct {
	favoriteRepo repository.FavoriteRepository
	vehicleRepo  repository.VehicleRepository
}

func NewFavoriteService(favoriteRepo repository.FavoriteRepository, vehicleRepo repository.VehicleRepository) *FavoriteService {
	return &FavoriteService{
		favoriteRepo: favoriteRepo,
		vehicleRepo:  vehicleRepo,
	}
}

func (s *FavoriteService) Add(userID, vehicleID uint) error {
	exists, err := s.favoriteRepo.Exists(userID, vehicleID)
	if err != nil {
		return err
	}
	if exists {
		return nil
	}

	vehicle, err := s.vehicleRepo.GetByID(vehicleID)
	if err != nil || vehicle == nil {
		return ErrVehicleNotFound
	}

	favorite := &domain.Favorite{
		UserID:    userID,
		VehicleID: vehicleID,
	}

	return s.favoriteRepo.Create(favorite)
}

func (s *FavoriteService) Remove(userID, vehicleID uint) error {
	return s.favoriteRepo.Delete(userID, vehicleID)
}

func (s *FavoriteService) List(userID uint) ([]domain.Favorite, error) {
	return s.favoriteRepo.GetByUserID(userID)
}
```

### internal/service/rating_service.go

```go
package service

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/repository"
)

type RatingService struct {
	ratingRepo repository.RatingRepository
}

func NewRatingService(ratingRepo repository.RatingRepository) *RatingService {
	return &RatingService{ratingRepo: ratingRepo}
}

func (s *RatingService) Create(raterUserID uint, req request.CreateRatingRequest) (*domain.Rating, error) {
	if raterUserID == req.TargetUserID {
		return nil, ErrUnauthorized
	}

	rating := &domain.Rating{
		RaterUserID:   raterUserID,
		TargetUserID:  req.TargetUserID,
		VehicleID:     req.VehicleID,
		TransactionID: req.TransactionID,
		Score:         req.Score,
		Comment:       req.Comment,
	}

	if err := s.ratingRepo.Create(rating); err != nil {
		return nil, err
	}

	return rating, nil
}

func (s *RatingService) GetByUserID(userID uint) ([]domain.Rating, error) {
	return s.ratingRepo.GetByUserID(userID)
}
```

### internal/service/message_service.go

```go
package service

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/repository"
)

type MessageService struct {
	messageRepo repository.MessageRepository
}

func NewMessageService(messageRepo repository.MessageRepository) *MessageService {
	return &MessageService{messageRepo: messageRepo}
}

func (s *MessageService) Send(senderID uint, req request.SendMessageRequest) (*domain.Message, error) {
	message := &domain.Message{
		SenderID:   senderID,
		ReceiverID: req.ReceiverID,
		VehicleID:  req.VehicleID,
		Content:    req.Content,
	}

	if err := s.messageRepo.Create(message); err != nil {
		return nil, err
	}

	return message, nil
}

func (s *MessageService) GetConversation(userID, otherUserID uint, vehicleID *uint) ([]domain.Message, error) {
	return s.messageRepo.GetConversation(userID, otherUserID, vehicleID)
}

func (s *MessageService) ListConversations(userID uint) ([]domain.Conversation, error) {
	return s.messageRepo.GetConversationsList(userID)
}

func (s *MessageService) MarkAsRead(messageID, userID uint) error {
	return s.messageRepo.MarkAsRead(messageID)
}
```

### internal/service/valuation_service.go

```go
package service

import (
	"concesionaria-web/internal/domain"
	"concesionaria-web/internal/dto/request"
	"concesionaria-web/internal/repository"
	"math"
)

type ValuationService struct {
	valuationRepo repository.ValuationRepository
}

func NewValuationService(valuationRepo repository.ValuationRepository) *ValuationService {
	return &ValuationService{valuationRepo: valuationRepo}
}

func (s *ValuationService) Create(userID uint, req request.CreateValuationRequest) (*domain.Valuation, error) {
	estimatedValue := s.calculateEstimatedValue(req)

	valuation := &domain.Valuation{
		UserID:          userID,
		Brand:           req.Brand,
		Model:           req.Model,
		Year:            req.Year,
		Mileage:         req.Mileage,
		FuelType:        req.FuelType,
		Condition:       req.Condition,
		EstimatedValue:  estimatedValue,
		Status:          "completed",
	}

	if err := s.valuationRepo.Create(valuation); err != nil {
		return nil, err
	}

	return valuation, nil
}

func (s *ValuationService) GetByID(id uint) (*domain.Valuation, error) {
	return s.valuationRepo.GetByID(id)
}

func (s *ValuationService) GetByUserID(userID uint) ([]domain.Valuation, error) {
	return s.valuationRepo.GetByUserID(userID)
}

func (s *ValuationService) calculateEstimatedValue(req request.CreateValuationRequest) float64 {
	basePrice := 10000.0
	basePrice += float64(req.Year-2020) * 2000
	basePrice -= float64(req.Mileage) * 0.05

	switch req.Condition {
	case "excellent":
		basePrice *= 1.2
	case "good":
		basePrice *= 1.0
	case "fair":
		basePrice *= 0.85
	case "poor":
		basePrice *= 0.7
	}

	return math.Round(basePrice*100) / 100
}
```

---

## 15. go.mod

```go
module concesionaria-web

go 1.21

require (
	github.com/aws/aws-sdk-go-v2 v1.24.0
	github.com/aws/aws-sdk-go-v2/config v1.26.1
	github.com/aws/aws-sdk-go-v2/service/s3 v1.47.5
	github.com/go-playground/validator/v10 v10.16.0
	github.com/gofiber/fiber/v2 v2.51.0
	github.com/golang-jwt/jwt/v5 v5.2.0
	github.com/lib/pq v1.10.9
	golang.org/x/crypto v0.17.0
	gorm.io/driver/postgres v1.5.4
	gorm.io/gorm v1.25.5
)
```

---

## 16. Next Steps

### Environment Variables Setup
Create a `.env` file with:
```
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=concesionaria
JWT_SECRET=your-super-secret-key-min-32-chars
STORAGE_TYPE=local
STORAGE_LOCAL_PATH=./uploads
STORAGE_BASE_URL=http://localhost:3000/uploads
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_DURATION=1m
```

### Database Indexes (Post-Migration)
```sql
CREATE INDEX idx_vehicles_brand_model ON vehicles(brand, model);
CREATE INDEX idx_vehicles_price_status ON vehicles(price, status);
CREATE INDEX idx_vehicles_seller_status ON vehicles(seller_id, status);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX idx_favorites_user_vehicle ON favorites(user_id, vehicle_id);
```

### Testing Strategy
1. Unit tests for services with mock repositories
2. Integration tests for handlers with test database
3. Use testify/assert for assertions
4. Test edge cases: invalid inputs, auth failures, not found scenarios

### Deployment Considerations
- Containerize with Docker multi-stage build
- Use docker-compose for local development
- Configure environment-specific settings via ENV variables
- Set up proper logging with structured JSON output
- Implement health check endpoint `/health`
