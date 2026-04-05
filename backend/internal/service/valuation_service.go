package service

import (
	"math"

	"github.com/concesionaria-web/backend/internal/domain"
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type ValuationService struct {
	repo *repository.ValuationRepository
}

func NewValuationService(repo *repository.ValuationRepository) *ValuationService {
	return &ValuationService{repo: repo}
}

type CreateValuationRequest struct {
	Brand     string `json:"brand"`
	Model     string `json:"model"`
	Year      int    `json:"year"`
	Mileage   int    `json:"mileage"`
	Condition string `json:"condition"`
	Notes     string `json:"notes"`
}

func (s *ValuationService) CreateValuation(userID uuid.UUID, req CreateValuationRequest) (*domain.Valuation, error) {
	estimatedPrice := calculateValuation(req.Year, req.Mileage, req.Condition)

	valuation := &domain.Valuation{
		UserID:         userID,
		Brand:          req.Brand,
		Model:          req.Model,
		Year:           req.Year,
		Mileage:        req.Mileage,
		Condition:      req.Condition,
		EstimatedPrice: decimal.NewFromFloat(estimatedPrice),
		Status:         "processed",
		Notes:          req.Notes,
	}

	if err := s.repo.Create(valuation); err != nil {
		return nil, err
	}

	return valuation, nil
}

func calculateValuation(year, mileage int, condition string) float64 {
	basePrice := 15000.0

	age := 2024 - year
	ageDepreciation := math.Min(float64(age)*0.10, 0.70)

	mileageDepreciation := math.Min(float64(mileage)/10000.0*0.05, 0.30)

	conditionMultiplier := map[string]float64{
		"excellent": 1.0,
		"good":      0.85,
		"fair":      0.70,
		"poor":      0.50,
	}[condition]

	price := basePrice * (1 - ageDepreciation - mileageDepreciation) * conditionMultiplier

	if price < 1000 {
		price = 1000
	}

	return math.Round(price*100) / 100
}

func (s *ValuationService) GetUserValuations(userID uuid.UUID) ([]domain.Valuation, error) {
	return s.repo.FindByUserID(userID)
}

func (s *ValuationService) GetValuationByID(id, userID uuid.UUID) (*domain.Valuation, error) {
	return s.repo.FindByIDAndUser(id, userID)
}
