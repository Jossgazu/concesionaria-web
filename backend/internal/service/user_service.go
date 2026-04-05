package service

import (
	"github.com/concesionaria-web/backend/internal/repository"
	"github.com/google/uuid"
)

type UserService struct {
	userRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
}

func (s *UserService) GetByID(id uuid.UUID) (*UserPublic, error) {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return &UserPublic{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Phone:     user.Phone,
		AvatarURL: user.AvatarURL,
		Role:      user.Role,
	}, nil
}

func (s *UserService) UpdateProfile(userID uuid.UUID, req *UpdateProfileRequest) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	if req.Name != "" {
		user.Name = req.Name
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}

	return s.userRepo.Update(user)
}

func (s *UserService) UpdateAvatar(userID uuid.UUID, avatarURL string) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}

	user.AvatarURL = avatarURL
	return s.userRepo.Update(user)
}

type UserPublic struct {
	ID        uuid.UUID
	Email     string
	Name      string
	Phone     string
	AvatarURL string
	Role      string
}
