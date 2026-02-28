package service

import (
	"context"
	"errors"
	"strings"

	"github.com/kosdok/backend/internal/auth/domain"
	"github.com/kosdok/backend/internal/auth/repo"
)

var ErrEmailRequired = errors.New("email is required")

type Service struct {
	repo repo.Repository
}

func NewService(r repo.Repository) *Service {
	return &Service{repo: r}
}

func (s *Service) GetMe(ctx context.Context, email string) (domain.AuthSubject, error) {
	normalized := strings.TrimSpace(strings.ToLower(email))
	if normalized == "" {
		return domain.AuthSubject{}, ErrEmailRequired
	}

	return s.repo.GetAuthSubjectByEmail(ctx, normalized)
}
