package repo

import (
	"context"
	"time"

	"github.com/kosdok/backend/internal/auth/domain"
)

const DefaultRolePatient = "patient"

type UserCredentials struct {
	UserID       string
	Email        string
	PasswordHash string
}

type CreateUserWithRoleParams struct {
	UserID       string
	Email        string
	PasswordHash string
	RoleName     string
	Now          time.Time
}

type CreateRefreshTokenParams struct {
	TokenID   string
	UserID    string
	TokenHash string
	ExpiresAt time.Time
	CreatedAt time.Time
}

type Repository interface {
	GetAuthSubjectByEmail(ctx context.Context, email string) (domain.AuthSubject, error)
	GetUserCredentialsByEmail(ctx context.Context, email string) (UserCredentials, error)
	CreateUserWithRole(ctx context.Context, params CreateUserWithRoleParams) error
	CreateRefreshToken(ctx context.Context, params CreateRefreshTokenParams) error
}
