package repo

import (
	"context"

	"github.com/kosdok/backend/internal/auth/domain"
)

type Repository interface {
	GetAuthSubjectByEmail(ctx context.Context, email string) (domain.AuthSubject, error)
}
