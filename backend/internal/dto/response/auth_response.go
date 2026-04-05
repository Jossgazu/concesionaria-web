package dto

type AuthResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

type UserResponse struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	Avatar    string `json:"avatar"`
	Role      string `json:"role"`
	CreatedAt string `json:"created_at"`
}

type UserWithStats struct {
	UserResponse
	VehiclesCount int64   `json:"vehicles_count"`
	AvgRating     float64 `json:"avg_rating"`
	TotalRatings  int64   `json:"total_ratings"`
}
