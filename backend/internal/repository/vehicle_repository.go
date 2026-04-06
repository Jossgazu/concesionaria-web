package repository

import (
	"fmt"
	"strings"
	"time"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VehicleRepository struct {
	db *gorm.DB
}

func NewVehicleRepository(db *gorm.DB) *VehicleRepository {
	return &VehicleRepository{db: db}
}

type VehicleFilter struct {
	Brand      string
	Model      string
	MinPrice   *float64
	MaxPrice   *float64
	MinMileage *int
	MaxMileage *int
	YearFrom   *int
	YearTo     *int
	BodyType   string
	FuelType   string
	Status     string
	Verified   *bool
	SellerID   *uuid.UUID
	Search     string
	SortBy     string
	SortOrder  string
	Page       int
	Limit      int
}

func (r *VehicleRepository) FindAll(filter VehicleFilter) ([]domain.Vehicle, int64, error) {
	var vehicles []domain.Vehicle
	var total int64

	query := r.db.Model(&domain.Vehicle{}).Where("deleted_at IS NULL")

	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	} else {
		query = query.Where("status IN ?", []string{"active", "pending"})
	}

	if filter.Brand != "" {
		query = query.Where("LOWER(brand) LIKE ?", "%"+strings.ToLower(filter.Brand)+"%")
	}

	if filter.Model != "" {
		query = query.Where("LOWER(model) LIKE ?", "%"+strings.ToLower(filter.Model)+"%")
	}

	if filter.MinPrice != nil {
		query = query.Where("price >= ?", *filter.MinPrice)
	}

	if filter.MaxPrice != nil {
		query = query.Where("price <= ?", *filter.MaxPrice)
	}

	if filter.MinMileage != nil {
		query = query.Where("mileage >= ?", *filter.MinMileage)
	}

	if filter.MaxMileage != nil {
		query = query.Where("mileage <= ?", *filter.MaxMileage)
	}

	if filter.YearFrom != nil {
		query = query.Where("year >= ?", *filter.YearFrom)
	}

	if filter.YearTo != nil {
		query = query.Where("year <= ?", *filter.YearTo)
	}

	if filter.BodyType != "" {
		query = query.Where("LOWER(body_type) = ?", strings.ToLower(filter.BodyType))
	}

	if filter.FuelType != "" {
		query = query.Where("LOWER(fuel_type) = ?", strings.ToLower(filter.FuelType))
	}

	if filter.Verified != nil {
		query = query.Where("verified = ?", *filter.Verified)
	}

	if filter.SellerID != nil {
		query = query.Where("seller_id = ?", *filter.SellerID)
	}

	if filter.Search != "" {
		searchTerm := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where("LOWER(brand) LIKE ? OR LOWER(model) LIKE ? OR LOWER(body_type) LIKE ? OR LOWER(fuel_type) LIKE ?", searchTerm, searchTerm, searchTerm, searchTerm)
	}

	query.Count(&total)

	sortBy := "created_at"
	if filter.SortBy != "" {
		sortBy = filter.SortBy
	}
	order := "DESC"
	if filter.SortOrder == "asc" {
		order = "ASC"
	}
	query = query.Order(fmt.Sprintf("%s %s", sortBy, order))

	if filter.Limit <= 0 {
		filter.Limit = 20
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}
	offset := (filter.Page - 1) * filter.Limit
	query = query.Offset(offset).Limit(filter.Limit)

	err := query.Preload("Images", "is_primary = true").
		Preload("Seller").
		Find(&vehicles).Error

	return vehicles, total, err
}

func (r *VehicleRepository) FindByID(id uuid.UUID) (*domain.Vehicle, error) {
	var vehicle domain.Vehicle
	err := r.db.Preload("Images").Preload("Specs").Preload("Seller").
		First(&vehicle, "id = ? AND deleted_at IS NULL", id).Error
	if err != nil {
		return nil, err
	}
	return &vehicle, nil
}

func (r *VehicleRepository) Create(vehicle *domain.Vehicle) error {
	return r.db.Create(vehicle).Error
}

func (r *VehicleRepository) Update(vehicle *domain.Vehicle) error {
	return r.db.Save(vehicle).Error
}

func (r *VehicleRepository) Delete(id uuid.UUID) error {
	return r.db.Model(&domain.Vehicle{}).Where("id = ?", id).Update("deleted_at", time.Now()).Error
}

func (r *VehicleRepository) IncrementViews(id uuid.UUID) error {
	return r.db.Model(&domain.Vehicle{}).Where("id = ?", id).UpdateColumn("views", gorm.Expr("views + ?", 1)).Error
}

func (r *VehicleRepository) FindBySeller(sellerID uuid.UUID, page, limit int) ([]domain.Vehicle, int64, error) {
	var vehicles []domain.Vehicle
	var total int64

	r.db.Model(&domain.Vehicle{}).Where("seller_id = ? AND deleted_at IS NULL", sellerID).Count(&total)

	offset := (page - 1) * limit
	err := r.db.Preload("Images").Where("seller_id = ? AND deleted_at IS NULL", sellerID).
		Offset(offset).Limit(limit).Order("created_at DESC").Find(&vehicles).Error
	if err != nil {
		return nil, 0, err
	}

	return vehicles, total, nil
}

func (r *VehicleRepository) FindFeatured(limit int) ([]domain.Vehicle, error) {
	var vehicles []domain.Vehicle
	err := r.db.Preload("Seller").Preload("Images").Where("verified = ? AND status = ?", true, "active").
		Limit(limit).Order("views DESC").Find(&vehicles).Error
	return vehicles, err
}

func (r *VehicleRepository) AddImage(image *domain.VehicleImage) error {
	return r.db.Create(image).Error
}

func (r *VehicleRepository) FindImageByID(id uuid.UUID) (*domain.VehicleImage, error) {
	var image domain.VehicleImage
	err := r.db.First(&image, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &image, nil
}

func (r *VehicleRepository) DeleteImage(id uuid.UUID) error {
	return r.db.Delete(&domain.VehicleImage{}, "id = ?", id).Error
}

func (r *VehicleRepository) SetPrimaryImage(vehicleID, imageID uuid.UUID) error {
	r.db.Model(&domain.VehicleImage{}).Where("vehicle_id = ?", vehicleID).Update("is_primary", false)
	return r.db.Model(&domain.VehicleImage{}).Where("id = ?", imageID).Update("is_primary", true).Error
}

func (r *VehicleRepository) CreateSpecs(specs *domain.VehicleSpecs) error {
	return r.db.Create(specs).Error
}

func (r *VehicleRepository) UpdateSpecs(specs *domain.VehicleSpecs) error {
	return r.db.Save(specs).Error
}

func (r *VehicleRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&domain.Vehicle{}).Where("deleted_at IS NULL").Count(&count).Error
	return count, err
}

func (r *VehicleRepository) CountByStatus(status string) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Vehicle{}).Where("status = ? AND deleted_at IS NULL", status).Count(&count).Error
	return count, err
}
