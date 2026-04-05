package domain

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	Name      string         `gorm:"not null" json:"name"`
	Phone     string         `json:"phone"`
	AvatarURL string         `json:"avatar_url"`
	Role      string         `gorm:"default:user" json:"role"`
	Bio       string         `json:"bio"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Vehicles  []Vehicle      `gorm:"foreignKey:SellerID" json:"vehicles,omitempty"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return nil
}

type Vehicle struct {
	ID           uuid.UUID       `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	SellerID     uuid.UUID       `gorm:"type:uuid;not null" json:"seller_id"`
	Seller       User            `gorm:"foreignKey:SellerID" json:"seller,omitempty"`
	Brand        string          `gorm:"type:varchar(100);not null;index" json:"brand"`
	Model        string          `gorm:"type:varchar(100);not null;index" json:"model"`
	Year         int             `gorm:"not null;index" json:"year"`
	Mileage      int             `gorm:"not null;index" json:"mileage"`
	Price        decimal.Decimal `gorm:"type:decimal(12,2);not null;index" json:"price"`
	Currency     string          `gorm:"type:varchar(10);default:'USD'" json:"currency"`
	BodyType     string          `gorm:"type:varchar(50);index" json:"body_type"`
	FuelType     string          `gorm:"type:varchar(50)" json:"fuel_type"`
	Transmission string          `gorm:"type:varchar(50)" json:"transmission"`
	Color        string          `gorm:"type:varchar(50)" json:"color"`
	Description  string          `gorm:"type:text" json:"description"`
	Status       string          `gorm:"type:varchar(20);default:'active';index" json:"status"`
	Verified     bool            `gorm:"default:false" json:"verified"`
	Views        int             `gorm:"default:0" json:"views"`
	Images       []VehicleImage  `gorm:"foreignKey:VehicleID" json:"images,omitempty"`
	Specs        *VehicleSpecs   `gorm:"foreignKey:VehicleID" json:"specs,omitempty"`
	Valuation    *Valuation      `gorm:"foreignKey:VehicleID" json:"valuation,omitempty"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
	DeletedAt    *time.Time      `gorm:"index" json:"-"`
}

func (v *Vehicle) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}

type VehicleImage struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	VehicleID uuid.UUID `gorm:"type:uuid;not null;index" json:"vehicle_id"`
	ImageURL  string    `gorm:"type:varchar(500);not null" json:"image_url"`
	IsPrimary bool      `gorm:"default:false" json:"is_primary"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
}

func (vi *VehicleImage) BeforeCreate(tx *gorm.DB) error {
	if vi.ID == uuid.Nil {
		vi.ID = uuid.New()
	}
	return nil
}

type VehicleSpecs struct {
	ID                 uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	VehicleID          uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"vehicle_id"`
	Engine             string    `gorm:"type:varchar(100)" json:"engine"`
	Horsepower         int       `json:"horsepower"`
	Torque             string    `gorm:"type:varchar(50)" json:"torque"`
	Displacement       float64   `json:"displacement"`
	TransmissionType   string    `gorm:"type:varchar(50)" json:"transmission_type"`
	Drivetrain         string    `gorm:"type:varchar(50)" json:"drivetrain"`
	FuelTankCapacity   float64   `json:"fuel_tank_capacity"`
	Seats              int       `json:"seats"`
	Doors              int       `json:"doors"`
	Weight             int       `json:"weight"`
	Length             float64   `json:"length"`
	Width              float64   `json:"width"`
	Height             float64   `json:"height"`
	TrunkCapacity      float64   `json:"trunk_capacity"`
	ConsumptionCity    float64   `json:"consumption_city"`
	ConsumptionHighway float64   `json:"consumption_highway"`
	Emissions          string    `gorm:"type:varchar(20)" json:"emissions"`
	SafetyFeatures     string    `gorm:"type:text" json:"safety_features"`
	ComfortFeatures    string    `gorm:"type:text" json:"comfort_features"`
	OtherFeatures      string    `gorm:"type:text" json:"other_features"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

func (vs *VehicleSpecs) BeforeCreate(tx *gorm.DB) error {
	if vs.ID == uuid.Nil {
		vs.ID = uuid.New()
	}
	return nil
}

type Valuation struct {
	ID             uuid.UUID       `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	UserID         uuid.UUID       `gorm:"type:uuid;not null" json:"user_id"`
	User           User            `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Brand          string          `gorm:"type:varchar(100);not null" json:"brand"`
	Model          string          `gorm:"type:varchar(100);not null" json:"model"`
	Year           int             `gorm:"not null" json:"year"`
	Mileage        int             `gorm:"not null" json:"mileage"`
	Condition      string          `gorm:"type:varchar(20)" json:"condition"`
	EstimatedPrice decimal.Decimal `gorm:"type:decimal(12,2)" json:"estimated_price"`
	Status         string          `gorm:"type:varchar(20);default:'processed'" json:"status"`
	Notes          string          `gorm:"type:text" json:"notes"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
}

func (v *Valuation) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}

type Favorite struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	VehicleID uuid.UUID `gorm:"type:uuid;not null" json:"vehicle_id"`
	Vehicle   Vehicle   `gorm:"foreignKey:VehicleID" json:"vehicle,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

func (f *Favorite) BeforeCreate(tx *gorm.DB) error {
	if f.ID == uuid.Nil {
		f.ID = uuid.New()
	}
	return nil
}

type Rating struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
	RaterID   uuid.UUID `gorm:"type:uuid;not null" json:"rater_id"`
	Rater     User      `gorm:"foreignKey:RaterID" json:"rater,omitempty"`
	TargetID  uuid.UUID `gorm:"type:uuid;not null" json:"target_id"`
	Target    User      `gorm:"foreignKey:TargetID" json:"target,omitempty"`
	Score     int       `gorm:"not null" json:"score"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}

func (r *Rating) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}

type Message struct {
	ID         uuid.UUID  `gorm:"type:uuid;primary_key" json:"id"`
	SenderID   uuid.UUID  `gorm:"type:uuid;not null" json:"sender_id"`
	Sender     User       `gorm:"foreignKey:SenderID" json:"sender,omitempty"`
	ReceiverID uuid.UUID  `gorm:"type:uuid;not null" json:"receiver_id"`
	Receiver   User       `gorm:"foreignKey:ReceiverID" json:"receiver,omitempty"`
	VehicleID  *uuid.UUID `gorm:"type:uuid" json:"vehicle_id,omitempty"`
	Vehicle    *Vehicle   `gorm:"foreignKey:VehicleID" json:"vehicle,omitempty"`
	Content    string     `gorm:"not null" json:"content"`
	Read       bool       `gorm:"default:false" json:"read"`
	CreatedAt  time.Time  `json:"created_at"`
}

func (m *Message) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}
