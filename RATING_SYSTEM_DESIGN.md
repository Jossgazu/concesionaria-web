# Concesionaria Web - Rating System Design Specification

## 1. Overview

This document specifies the complete rating and review system for **Concesionaria Web**, a multi-vendor car marketplace. The system enables buyers and sellers to rate each other after transactions, building trust across the platform.

---

## 2. Database Schema

### 2.1 Current Schema (Existing)

```sql
-- From schema.sql lines 214-248
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    transaction_id UUID,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ratings_no_self CHECK (rater_id != rated_user_id)
);
```

### 2.2 Required Schema Enhancements

#### 2.2.1 Add Rating Direction Enum

```sql
-- Add to ENUMS section
CREATE TYPE rating_direction AS ENUM ('buyer_to_seller', 'seller_to_buyer');
```

#### 2.2.2 Updated Ratings Table

```sql
-- Drop existing ratings table and recreate with enhancements
DROP TABLE IF EXISTS ratings CASCADE;

CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    rated_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    transaction_id UUID NOT NULL,
    direction rating_direction NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    seller_response TEXT,
    seller_response_at TIMESTAMP WITH TIME ZONE,
    is_verified_purchase BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ratings_no_self CHECK (rater_id != rated_user_id),
    CONSTRAINT ratings_unique_direction UNIQUE (rater_id, transaction_id, direction)
);

CREATE INDEX idx_ratings_rated_user ON ratings(rated_user_id);
CREATE INDEX idx_ratings_rater ON ratings(rater_id);
CREATE INDEX idx_ratings_vehicle ON ratings(vehicle_id) WHERE vehicle_id IS NOT NULL;
CREATE INDEX idx_ratings_transaction ON ratings(transaction_id);
CREATE INDEX idx_ratings_score ON ratings(score);
CREATE INDEX idx_ratings_created ON ratings(created_at DESC);
```

#### 2.2.3 Rating Summary View (Enhanced)

```sql
CREATE OR REPLACE VIEW seller_ratings_summary AS
SELECT 
    rated_user_id,
    COUNT(*) as total_reviews,
    AVG(score)::DECIMAL(3,2) as average_rating,
    COUNT(*) FILTER (WHERE score = 5) as five_star,
    COUNT(*) FILTER (WHERE score = 4) as four_star,
    COUNT(*) FILTER (WHERE score = 3) as three_star,
    COUNT(*) FILTER (WHERE score = 2) as two_star,
    COUNT(*) FILTER (WHERE score = 1) as one_star,
    MIN(created_at) as first_review_at,
    MAX(created_at) as last_review_at
FROM ratings
GROUP BY rated_user_id;

-- View for user's ratings received (as buyer or seller)
CREATE OR REPLACE VIEW user_ratings_summary AS
SELECT 
    rated_user_id,
    direction,
    COUNT(*) as total_reviews,
    AVG(score)::DECIMAL(3,2) as average_rating
FROM ratings
GROUP BY rated_user_id, direction;
```

#### 2.2.4 Updated Transactions Table

```sql
-- Add rating status tracking to transactions
ALTER TABLE transactions 
ADD COLUMN buyer_rated BOOLEAN DEFAULT false,
ADD COLUMN seller_rated BOOLEAN DEFAULT false,
ADD COLUMN rating_deadline TIMESTAMP WITH TIME ZONE;

-- Set rating deadline to 30 days after transaction completion
CREATE OR REPLACE FUNCTION set_rating_deadline()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.rating_deadline = CURRENT_TIMESTAMP + INTERVAL '30 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_transactions_rating_deadline
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION set_rating_deadline();
```

---

## 3. Data Model

### 3.1 Rating Entity

```typescript
interface Rating {
  id: string;                    // UUID
  raterId: string;               // User who gave the rating
  ratedUserId: string;           // User who received the rating
  vehicleId: string | null;      // Related vehicle listing
  transactionId: string;         // Related transaction
  direction: 'buyer_to_seller' | 'seller_to_buyer';
  score: number;                 // 1-5 stars
  comment: string | null;        // Optional review text
  sellerResponse: string | null; // Seller's response to review
  sellerResponseAt: Date | null;
  isVerifiedPurchase: boolean;  // Always true if transaction exists
  createdAt: Date;
  updatedAt: Date;
}

interface RatingSummary {
  userId: string;
  averageRating: number;         // e.g., 4.5
  totalReviews: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  asSellerRating: number | null;  // Rating when acting as seller
  asBuyerRating: number | null;   // Rating when acting as buyer
  firstReviewAt: Date | null;
  lastReviewAt: Date | null;
}

interface RatingWithUser extends Rating {
  rater: {
    id: string;
    name: string;
    avatar: string | null;
  };
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    year: number;
  };
}
```

### 3.2 Transaction Rating Status

```typescript
interface TransactionRatingStatus {
  transactionId: string;
  buyerId: string;
  sellerId: string;
  buyerHasRatedSeller: boolean;
  sellerHasRatedBuyer: boolean;
  buyerCanRate: boolean;        // Within deadline, hasn't rated
  sellerCanRate: boolean;
  ratingDeadline: Date | null;
}
```

---

## 4. API Endpoints

### 4.1 Rating Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ratings` | Create a rating | Required |
| GET | `/api/ratings/user/:userId` | Get ratings received by user | Public |
| GET | `/api/ratings/user/:userId/summary` | Get rating summary for user | Public |
| GET | `/api/ratings/transaction/:transactionId` | Get ratings for a transaction | Auth (participant) |
| PUT | `/api/ratings/:ratingId/response` | Seller responds to review | Auth (rating owner) |
| DELETE | `/api/ratings/:ratingId` | Delete own rating | Auth (rater) |

### 4.2 Detailed Endpoint Specifications

#### POST /api/ratings

**Request Body:**
```json
{
  "targetUserId": "uuid",
  "transactionId": "uuid",
  "score": 5,
  "comment": "Excelente vendedor, muy profesional..."
}
```

**Validation Rules:**
- `targetUserId`: Required, must exist, cannot be self
- `transactionId`: Required, must be completed transaction between users
- `score`: Required, integer 1-5
- `comment`: Optional, max 1000 characters
- Cannot rate same direction for same transaction twice
- Rating deadline (30 days) must not have passed

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "score": 5,
    "comment": "Excelente vendedor...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Codes:**
- `RATING_SELF`: Cannot rate yourself
- `TRANSACTION_NOT_COMPLETED`: Transaction must be completed
- `TRANSACTION_NOT_FOUND`: Transaction does not exist
- `NOT_TRANSACTION_PARTICIPANT`: User not part of transaction
- `RATING_DEADLINE_PASSED`: 30-day rating window closed
- `ALREADY_RATED`: Already rated this direction for this transaction
- `INVALID_SCORE`: Score must be 1-5

#### GET /api/ratings/user/:userId

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `asSeller`: Filter to ratings received as seller (true/false)
- `sort`: `newest` | `oldest` | `highest` | `lowest`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "score": 5,
        "comment": "Excelente vendedor...",
        "direction": "buyer_to_seller",
        "rater": {
          "id": "uuid",
          "name": "María García",
          "avatar": "url"
        },
        "vehicle": {
          "id": "uuid",
          "brand": "Toyota",
          "model": "Corolla",
          "year": 2023
        },
        "sellerResponse": "Gracias por tu compra...",
        "sellerResponseAt": "2024-01-16T14:00:00Z",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### GET /api/ratings/user/:userId/summary

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "averageRating": 4.7,
    "totalReviews": 24,
    "asSeller": {
      "averageRating": 4.8,
      "totalReviews": 20
    },
    "asBuyer": {
      "averageRating": 4.2,
      "totalReviews": 4
    },
    "breakdown": {
      "fiveStar": 18,
      "fourStar": 4,
      "threeStar": 1,
      "twoStar": 1,
      "oneStar": 0
    },
    "firstReviewAt": "2023-06-15T10:30:00Z",
    "lastReviewAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/ratings/transaction/:transactionId

**Authorization:** Only buyer or seller in the transaction

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactionId": "uuid",
    "buyerToSellerRating": {
      "id": "uuid",
      "score": 5,
      "comment": "...",
      "createdAt": "..."
    } | null,
    "sellerToBuyerRating": {
      "id": "uuid",
      "score": 4,
      "comment": "...",
      "createdAt": "..."
    } | null,
    "buyerCanRate": false,
    "sellerCanRate": false,
    "ratingDeadline": "2024-02-15T10:30:00Z"
  }
}
```

#### PUT /api/ratings/:ratingId/response

**Authorization:** Only the rated user (seller) can respond

**Request Body:**
```json
{
  "response": "Gracias por tu evaluación. Fue un placer hacer negocios contigo."
}
```

**Validation:**
- Max 500 characters
- Can only respond once (cannot edit later)
- Can only respond to ratings received as seller

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sellerResponse": "Gracias por tu evaluación...",
    "sellerResponseAt": "2024-01-16T14:00:00Z"
  }
}
```

---

## 5. Backend Implementation

### 5.1 Rating Service

```go
// internal/service/rating_service.go

type RatingService struct {
    ratingRepo repository.RatingRepository
    txRepo     repository.TransactionRepository
    userRepo   repository.UserRepository
}

var (
    ErrRatingSelf           = errors.New("cannot rate yourself")
    ErrTransactionNotFound = errors.New("transaction not found")
    ErrNotTransactionParticipant = errors.New("not a participant in this transaction")
    ErrTransactionNotCompleted  = errors.New("transaction is not completed")
    ErrRatingDeadlinePassed = errors.New("rating deadline has passed")
    ErrAlreadyRated        = errors.New("already rated in this direction")
    ErrCannotRespondToRating = errors.New("cannot respond to this rating")
    ErrAlreadyResponded    = errors.New("already responded to this rating")
)

const RatingDeadlineDays = 30

func (s *RatingService) Create(userID uint, req request.CreateRatingRequest) (*domain.Rating, error) {
    // 1. Validate not self-rating
    if userID == req.TargetUserID {
        return nil, ErrRatingSelf
    }

    // 2. Get and validate transaction
    tx, err := s.txRepo.GetByID(req.TransactionID)
    if err != nil || tx == nil {
        return nil, ErrTransactionNotFound
    }

    // 3. Verify user is participant
    isBuyer := tx.BuyerID == userID
    isSeller := tx.SellerID == userID
    if !isBuyer && !isSeller {
        return nil, ErrNotTransactionParticipant
    }

    // 4. Verify transaction is completed
    if tx.Status != "completed" {
        return nil, ErrTransactionNotCompleted
    }

    // 5. Check rating deadline
    if tx.RatingDeadline != nil && time.Now().After(*tx.RatingDeadline) {
        return nil, ErrRatingDeadlinePassed
    }

    // 6. Determine direction and check for existing rating
    direction := "buyer_to_seller"
    if isSeller {
        direction = "seller_to_buyer"
    }

    existing, err := s.ratingRepo.ExistsByDirection(userID, req.TransactionID, direction)
    if err != nil {
        return nil, err
    }
    if existing {
        return nil, ErrAlreadyRated
    }

    // 7. Create rating
    rating := &domain.Rating{
        RaterUserID:   userID,
        RatedUserID:   req.TargetUserID,
        VehicleID:     tx.VehicleID,
        TransactionID: req.TransactionID,
        Direction:     direction,
        Score:         req.Score,
        Comment:       req.Comment,
        IsVerifiedPurchase: true,
    }

    if err := s.ratingRepo.Create(rating); err != nil {
        return nil, err
    }

    // 8. Update transaction rating flag
    if isBuyer {
        s.txRepo.SetBuyerRated(req.TransactionID)
    } else {
        s.txRepo.SetSellerRated(req.TransactionID)
    }

    return rating, nil
}

func (s *RatingService) GetByUserID(userID uint, filter request.RatingFilterRequest) ([]domain.RatingWithUser, int64, error) {
    return s.ratingRepo.GetByUserID(userID, filter)
}

func (s *RatingService) GetSummary(userID uint) (*domain.RatingSummary, error) {
    return s.ratingRepo.GetSummary(userID)
}

func (s *RatingService) GetTransactionRatings(txID, userID uint) (*domain.TransactionRatings, error) {
    tx, err := s.txRepo.GetByID(txID)
    if err != nil || tx == nil {
        return nil, ErrTransactionNotFound
    }

    if tx.BuyerID != userID && tx.SellerID != userID {
        return nil, ErrNotTransactionParticipant
    }

    ratings, err := s.ratingRepo.GetByTransactionID(txID)
    if err != nil {
        return nil, err
    }

    result := &domain.TransactionRatings{
        TransactionID: txID,
        RatingDeadline: tx.RatingDeadline,
    }

    for _, r := range ratings {
        if r.Direction == "buyer_to_seller" {
            result.BuyerToSellerRating = r
        } else {
            result.SellerToBuyerRating = r
        }
    }

    result.BuyerCanRate = tx.BuyerID == userID && !tx.BuyerRated && (tx.RatingDeadline == nil || time.Now().Before(*tx.RatingDeadline))
    result.SellerCanRate = tx.SellerID == userID && !tx.SellerRated && (tx.RatingDeadline == nil || time.Now().Before(*tx.RatingDeadline))

    return result, nil
}

func (s *RatingService) AddResponse(ratingID, userID uint, response string) (*domain.Rating, error) {
    rating, err := s.ratingRepo.GetByID(ratingID)
    if err != nil || rating == nil {
        return nil, ErrRatingNotFound
    }

    // Only the rated user can respond
    if rating.RatedUserID != userID {
        return nil, ErrCannotRespondToRating
    }

    // Cannot respond to own rating
    if rating.RaterUserID == userID {
        return nil, ErrCannotRespondToRating
    }

    // Already responded
    if rating.SellerResponse != "" {
        return nil, ErrAlreadyResponded
    }

    rating.SellerResponse = response
    rating.SellerResponseAt = time.Now()

    if err := s.ratingRepo.Update(rating); err != nil {
        return nil, err
    }

    return rating, nil
}
```

### 5.2 Rating Repository

```go
// internal/repository/rating_repository.go

type RatingRepository interface {
    Create(rating *domain.Rating) error
    GetByID(id uint) (*domain.Rating, error)
    Update(rating *domain.Rating) error
    Delete(id uint) error
    ExistsByDirection(raterID uint, txID uint, direction string) (bool, error)
    GetByUserID(userID uint, filter request.RatingFilterRequest) ([]domain.RatingWithUser, int64, error)
    GetByTransactionID(txID uint) ([]domain.Rating, error)
    GetSummary(userID uint) (*domain.RatingSummary, error)
}

type ratingRepository struct {
    db *gorm.DB
}

func (r *ratingRepository) Create(rating *domain.Rating) error {
    return r.db.Create(rating).Error
}

func (r *ratingRepository) ExistsByDirection(raterID uint, txID uint, direction string) (bool, error) {
    var count int64
    err := r.db.Model(&domain.Rating{}).
        Where("rater_id = ? AND transaction_id = ? AND direction = ?", raterID, txID, direction).
        Count(&count).Error
    return count > 0, err
}

func (r *ratingRepository) GetByUserID(userID uint, filter request.RatingFilterRequest) ([]domain.RatingWithUser, int64, error) {
    var ratings []domain.RatingWithUser
    var total int64

    query := r.db.Model(&domain.Rating{}).
        Where("rated_user_id = ?", userID)

    if filter.AsSeller {
        query = query.Where("direction = ?", "buyer_to_seller")
    } else if filter.AsBuyer {
        query = query.Where("direction = ?", "seller_to_buyer")
    }

    query.Count(&total)

    switch filter.Sort {
    case "oldest":
        query = query.Order("created_at ASC")
    case "highest":
        query = query.Order("score DESC")
    case "lowest":
        query = query.Order("score ASC")
    default: // newest
        query = query.Order("created_at DESC")
    }

    offset := (filter.Page - 1) * filter.Limit
    err := query.
        Preload("Rater").
        Preload("Vehicle").
        Offset(offset).
        Limit(filter.Limit).
        Find(&ratings).Error

    return ratings, total, err
}

func (r *ratingRepository) GetSummary(userID uint) (*domain.RatingSummary, error) {
    var summary domain.RatingSummary

    // Overall stats
    row := r.db.Model(&domain.Rating{}).
        Select(`
            COUNT(*) as total_reviews,
            AVG(score)::DECIMAL(3,2) as average_rating,
            COUNT(*) FILTER (WHERE score = 5) as five_star,
            COUNT(*) FILTER (WHERE score = 4) as four_star,
            COUNT(*) FILTER (WHERE score = 3) as three_star,
            COUNT(*) FILTER (WHERE score = 2) as two_star,
            COUNT(*) FILTER (WHERE score = 1) as one_star,
            MIN(created_at) as first_review_at,
            MAX(created_at) as last_review_at
        `).
        Where("rated_user_id = ?", userID).
        Row()

    err := row.Scan(
        &summary.TotalReviews,
        &summary.AverageRating,
        &summary.FiveStar, &summary.FourStar, &summary.ThreeStar,
        &summary.TwoStar, &summary.OneStar,
        &summary.FirstReviewAt, &summary.LastReviewAt,
    )
    if err != nil {
        return nil, err
    }

    // As seller stats
    sellerRow := r.db.Model(&domain.Rating{}).
        Select("COUNT(*), AVG(score)::DECIMAL(3,2)").
        Where("rated_user_id = ? AND direction = ?", userID, "buyer_to_seller").
        Row()
    sellerRow.Scan(&summary.AsSellerTotalReviews, &summary.AsSellerRating)

    // As buyer stats
    buyerRow := r.db.Model(&domain.Rating{}).
        Select("COUNT(*), AVG(score)::DECIMAL(3,2)").
        Where("rated_user_id = ? AND direction = ?", userID, "seller_to_buyer").
        Row()
    buyerRow.Scan(&summary.AsBuyerTotalReviews, &summary.AsBuyerRating)

    return &summary, nil
}
```

---

## 6. Frontend Components

### 6.1 Component Inventory

| Component | Description | States |
|-----------|-------------|--------|
| `StarRating` | Interactive 1-5 star rating input | default, hover, selected, disabled |
| `StarDisplay` | Read-only star display | sizes: sm, md, lg |
| `RatingSummary` | Average rating + count display | with/without breakdown |
| `RatingBreakdown` | 5-4-3-2-1 star bar chart | default, hover on bar |
| `ReviewCard` | Individual review display | default, with response |
| `ReviewList` | Paginated list of reviews | loading, empty, populated |
| `RateSellerModal` | Modal for leaving a rating | step 1: stars, step 2: comment |
| `RatingPrompt` | Prompt to rate after transaction | buyer version, seller version |

### 6.2 StarRating Component

```tsx
// components/StarRating.tsx

interface StarRatingProps {
  value: number;           // Current rating (1-5)
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showLabel?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 'md',
  disabled = false,
  showLabel = false,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizes = {
    sm: { star: 16, gap: 2 },
    md: { star: 24, gap: 4 },
    lg: { star: 32, gap: 6 },
  };

  const handleClick = (star: number) => {
    if (!disabled && onChange) {
      onChange(star);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          disabled={disabled}
          className={cn(
            "transition-colors",
            disabled ? "cursor-default" : "cursor-pointer"
          )}
        >
          <StarIcon
            className={cn(
              "transition-transform",
              star <= displayValue
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300",
              !disabled && "hover:scale-110"
            )}
            style={{ width: sizes[size].star, height: sizes[size].star }}
          />
        </button>
      ))}
      {showLabel && value > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          ({value}/5)
        </span>
      )}
    </div>
  );
};
```

### 6.3 RatingSummary Component

```tsx
// components/RatingSummary.tsx

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  asSellerRating?: number | null;
  asBuyerRating?: number | null;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalReviews,
  asSellerRating,
  asBuyerRating,
  showBreakdown = false,
  size = 'md',
  className,
}) => {
  const textSizes = {
    sm: { average: 'text-lg', count: 'text-xs' },
    md: { average: 'text-2xl', count: 'text-sm' },
    lg: { average: 'text-4xl', count: 'text-base' },
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-bold text-gray-900", textSizes[size].average)}>
          {averageRating.toFixed(1)}
        </span>
        <StarDisplay rating={averageRating} size={size === 'lg' ? 'md' : 'sm'} />
        <span className={cn("text-gray-500", textSizes[size].count)}>
          ({totalReviews} {totalReviews === 1 ? 'evaluación' : 'evaluaciones'})
        </span>
      </div>

      {(asSellerRating !== undefined || asBuyerRating !== undefined) && (
        <div className="flex gap-4 mt-2 text-sm">
          {asSellerRating !== undefined && (
            <span className="text-gray-600">
              Como vendedor: <strong>{asSellerRating?.toFixed(1) ?? 'N/A'}</strong>
            </span>
          )}
          {asBuyerRating !== undefined && (
            <span className="text-gray-600">
              Como comprador: <strong>{asBuyerRating?.toFixed(1) ?? 'N/A'}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
```

### 6.4 ReviewCard Component

```tsx
// components/ReviewCard.tsx

interface ReviewCardProps {
  review: {
    id: string;
    score: number;
    comment: string | null;
    direction: 'buyer_to_seller' | 'seller_to_buyer';
    rater: {
      name: string;
      avatar: string | null;
    };
    vehicle?: {
      brand: string;
      model: string;
      year: number;
    };
    sellerResponse?: string | null;
    sellerResponseAt?: string | null;
    createdAt: string;
  };
  onRespond?: (reviewId: string) => void;
  canRespond?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onRespond,
  canRespond = false,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.rater.avatar}
            alt={review.rater.name}
            size="md"
          />
          <div>
            <p className="font-medium text-gray-900">{review.rater.name}</p>
            <p className="text-sm text-gray-500">
              {review.direction === 'buyer_to_seller' 
                ? 'Comprador' 
                : 'Vendedor'}
              {' · '}
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarDisplay rating={review.score} size="sm" />
      </div>

      {review.vehicle && (
        <div className="mt-3 text-sm text-gray-600">
          Sobre: {review.vehicle.year} {review.vehicle.brand} {review.vehicle.model}
        </div>
      )}

      {review.comment && (
        <p className="mt-3 text-gray-700">{review.comment}</p>
      )}

      {review.sellerResponse && (
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <MessageCircleIcon className="w-4 h-4" />
            <span>Respuesta del vendedor</span>
            {review.sellerResponseAt && (
              <span>· {formatDate(review.sellerResponseAt)}</span>
            )}
          </div>
          <p className="text-gray-700">{review.sellerResponse}</p>
        </div>
      )}

      {canRespond && !review.sellerResponse && (
        <button
          onClick={() => onRespond?.(review.id)}
          className="mt-3 text-sm text-primary-600 hover:text-primary-700"
        >
          Responder a esta evaluación
        </button>
      )}
    </div>
  );
};
```

### 6.5 RateSellerModal Component

```tsx
// components/RateSellerModal.tsx

interface RateSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: { score: number; comment?: string }) => Promise<void>;
  transaction: {
    id: string;
    vehicle: { brand: string; model: string; year: number };
    seller: { name: string };
  };
  existingRating?: { score: number; comment?: string } | null;
}

const RateSellerModal: React.FC<RateSellerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  existingRating,
}) => {
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(existingRating?.score ?? 0);
  const [comment, setComment] = useState(existingRating?.comment ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ score, comment: comment || undefined });
      onClose();
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoreLabels = [
    'Muy insatisfecho',
    'Insatisfecho',
    'Neutral',
    'Satisfecho',
    'Muy satisfecho',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calificar al vendedor">
      {existingRating ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Ya has calificado a este vendedor.</p>
          <div className="mt-4">
            <StarDisplay rating={existingRating.score} size="lg" />
          </div>
          {existingRating.comment && (
            <p className="mt-2 text-gray-700">"{existingRating.comment}"</p>
          )}
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-2">
              ¿Cómo fue tu experiencia con
            </p>
            <p className="font-semibold text-lg">
              {transaction.seller.name}
            </p>
            <p className="text-sm text-gray-500">
              {transaction.vehicle.year} {transaction.vehicle.brand} {transaction.vehicle.model}
            </p>
          </div>

          {step === 1 && (
            <div className="flex flex-col items-center">
              <StarRating
                value={score}
                onChange={setScore}
                size="lg"
              />
              {score > 0 && (
                <p className="mt-2 text-gray-600">
                  {scoreLabels[score - 1]}
                </p>
              )}
              <button
                onClick={() => setStep(2)}
                disabled={score === 0}
                className="mt-6 w-full py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos más sobre tu experiencia..."
                maxLength={1000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {comment.length}/1000
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar calificación'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
```

### 6.6 SellerCard with Ratings

```tsx
// components/SellerCard.tsx

interface SellerCardProps {
  seller: {
    id: string;
    name: string;
    avatar: string | null;
    bio?: string;
    isVerified: boolean;
    averageRating: number | null;
    totalReviews: number;
    activeListings: number;
    memberSince: string;
  };
  onContact?: () => void;
  onMessage?: () => void;
  className?: string;
}

const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  onContact,
  onMessage,
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 p-5", className)}>
      <div className="flex items-start gap-4">
        <Avatar src={seller.avatar} alt={seller.name} size="lg" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {seller.name}
            </h3>
            {seller.isVerified && (
              <Badge variant="verified" icon={<CheckIcon />}>
                Verificado
              </Badge>
            )}
          </div>

          {seller.averageRating !== null && seller.totalReviews > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarDisplay rating={seller.averageRating} size="sm" />
              <span className="text-sm text-gray-600">
                {seller.averageRating.toFixed(1)} ({seller.totalReviews}{' '}
                {seller.totalReviews === 1 ? 'evaluación' : 'evaluaciones'})
              </span>
            </div>
          )}

          <p className="mt-1 text-sm text-gray-500">
            {seller.activeListings} {seller.activeListings === 1 ? 'vehículo' : 'vehículos'} en venta
          </p>
        </div>
      </div>

      {seller.bio && (
        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {seller.bio}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        {onContact && (
          <button
            onClick={onContact}
            className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Contactar
          </button>
        )}
        {onMessage && (
          <button
            onClick={onMessage}
            className="flex-1 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
          >
            Mensaje
          </button>
        )}
      </div>
    </div>
  );
};
```

---

## 7. Display Logic

### 7.1 Rating Display Rules

| Context | Display | Details |
|---------|---------|---------|
| Vehicle Card | Seller rating badge | "★ 4.5 (24)" if available |
| Vehicle Detail | SellerCard with full ratings | Rating summary + response count |
| User Profile | RatingSummary header + ReviewList | Full breakdown, paginated reviews |
| Seller Dashboard | Stats cards with rating | Avg rating, pending ratings |
| Transaction Detail | Rating status + prompts | "Rate now" buttons if eligible |

### 7.2 Conditional Prompts

```typescript
// After transaction completion, show rating prompt
const showRatingPrompt = (transaction: Transaction, currentUserId: string) => {
  if (transaction.status !== 'completed') return null;
  
  const isBuyer = transaction.buyerId === currentUserId;
  const isSeller = transaction.sellerId === currentUserId;
  const deadline = transaction.ratingDeadline;
  
  if (deadline && new Date() > deadline) return null; // Deadline passed
  
  if (isBuyer && !transaction.buyerRated) {
    return { type: 'rate_seller', deadline };
  }
  
  if (isSeller && !transaction.sellerRated) {
    return { type: 'rate_buyer', deadline };
  }
  
  return null;
};
```

### 7.3 Rating Badges

| Rating Count | Badge | Display |
|--------------|-------|---------|
| 0 | None | No badge shown |
| 1-4 | Standard | "★ 4.2 (12)" |
| 5-19 | Trusted | "★ 4.5 (24)" with subtle badge |
| 20-49 | Top Rated | "★ 4.7 (38) ★" with star badge |
| 50+ | Elite | "★ 4.8 (62) ★★" with double star badge |

---

## 8. Edge Cases & Error Handling

### 8.1 Edge Cases

| Scenario | Handling |
|----------|----------|
| User has no ratings | Show "Sin evaluaciones aún" with prompt to be first |
| Rating deadline passed | Hide rating button, show "Periodo de calificación cerrado" |
| Self-rating attempt | Server-side block, return error code |
| Double rating attempt | Return `ALREADY_RATED` error |
| Transaction not found | Return `TRANSACTION_NOT_FOUND` error |
| Not transaction participant | Return `NOT_TRANSACTION_PARTICIPANT` error |
| Rating without completed transaction | Return `TRANSACTION_NOT_COMPLETED` error |
| Seller responds to buyer rating | Allow, seller can always respond |
| Rater tries to delete rating | Allow within 5 minutes of creation |
| Very long comment | Truncate at 1000 chars, show "ver más" |

### 8.2 Error Codes

```typescript
const RATING_ERRORS = {
  RATING_SELF: {
    code: 'RATING_SELF',
    message: 'No puedes calificarte a ti mismo',
    httpStatus: 400,
  },
  TRANSACTION_NOT_FOUND: {
    code: 'TRANSACTION_NOT_FOUND',
    message: 'Transacción no encontrada',
    httpStatus: 404,
  },
  NOT_TRANSACTION_PARTICIPANT: {
    code: 'NOT_TRANSACTION_PARTICIPANT',
    message: 'No eres parte de esta transacción',
    httpStatus: 403,
  },
  TRANSACTION_NOT_COMPLETED: {
    code: 'TRANSACTION_NOT_COMPLETED',
    message: 'La transacción debe estar completada para calificar',
    httpStatus: 400,
  },
  RATING_DEADLINE_PASSED: {
    code: 'RATING_DEADLINE_PASSED',
    message: 'El periodo de 30 días para calificar ha expirado',
    httpStatus: 400,
  },
  ALREADY_RATED: {
    code: 'ALREADY_RATED',
    message: 'Ya has calificado en esta dirección',
    httpStatus: 409,
  },
  INVALID_SCORE: {
    code: 'INVALID_SCORE',
    message: 'La calificación debe ser entre 1 y 5',
    httpStatus: 400,
  },
  CANNOT_RESPOND_TO_RATING: {
    code: 'CANNOT_RESPOND_TO_RATING',
    message: 'Solo el vendedor puede responder a evaluaciones de compradores',
    httpStatus: 403,
  },
  ALREADY_RESPONDED: {
    code: 'ALREADY_RESPONDED',
    message: 'Ya has respondido a esta evaluación',
    httpStatus: 409,
  },
};
```

---

## 9. User Flows

### 9.1 Buyer Rates Seller Flow

```
1. Transaction marked as "completed"
2. Buyer sees "Calificar al vendedor" prompt
3. Buyer clicks → RateSellerModal opens
4. Step 1: Select 1-5 stars
5. Step 2: Write optional comment
6. Submit → Rating created
7. Transaction.buyerRated = true
8. Success toast shown
9. Later: Seller can respond to review
```

### 9.2 Seller Rates Buyer Flow

```
1. Transaction marked as "completed"
2. Seller sees "Calificar al comprador" prompt in dashboard
3. Seller clicks → Quick rating form (simplified)
4. Submit → Rating created
5. Transaction.sellerRated = true
6. Both ratings complete → Transaction fully closed
```

### 9.3 Seller Responds to Review Flow

```
1. Seller sees new review notification
2. Seller views review on profile page
3. Clicks "Responder a esta evaluación"
4. Writes response (max 500 chars)
5. Submit → Response saved with timestamp
6. Response displayed on review card
```

---

## 10. Notifications

### 10.1 Notification Types

| Event | Recipient | Title | Body |
|-------|-----------|-------|------|
| New rating received | Seller | "Nueva evaluación" | "{buyer} te evaluó con {score} estrellas" |
| Rating response received | Buyer | "Respuesta del vendedor" | "{seller} respondió a tu evaluación" |
| Rating deadline approaching | Rater | "Recuerda calificar" | "Tienes {days} días para calificar tu compra" |
| Rating deadline passed | Seller | "Evaluación pendiente" | "El periodo para que {buyer} te califique ha expirado" |

---

## 11. Implementation Priority

### Phase 1 - Core (MVP)
1. Database schema updates
2. Rating creation API
3. Get ratings API
4. RatingSummary API
5. Basic frontend display

### Phase 2 - Enhanced
1. RateSellerModal with steps
2. Seller response capability
3. Transaction rating status
4. Rating prompts after transactions
5. Email notifications

### Phase 3 - Polish
1. Rating badges and thresholds
2. Rating breakdown visualization
3. Dashboard stats integration
4. Review moderation (admin)
5. Reporting inappropriate reviews
