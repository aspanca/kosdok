package service

import (
	"context"
	"testing"
	"time"

	"github.com/kosdok/backend/internal/auth/domain"
	"github.com/kosdok/backend/internal/auth/repo"
	"github.com/stretchr/testify/require"
)

type fakeRepo struct {
	subject     domain.AuthSubject
	err         error
	email       *string
	credentials repo.UserCredentials
	refresh     repo.RefreshToken
}

func (f fakeRepo) GetAuthSubjectByEmail(_ context.Context, email string) (domain.AuthSubject, error) {
	if f.email != nil {
		*f.email = email
	}
	return f.subject, f.err
}

func (f fakeRepo) GetUserCredentialsByEmail(_ context.Context, _ string) (repo.UserCredentials, error) {
	return f.credentials, f.err
}

func (f fakeRepo) GetAuthSubjectByUserID(_ context.Context, _ string) (domain.AuthSubject, error) {
	return f.subject, f.err
}

func (f fakeRepo) CreateUserWithRole(_ context.Context, _ repo.CreateUserWithRoleParams) error {
	return f.err
}

func (f fakeRepo) CreateRefreshToken(_ context.Context, _ repo.CreateRefreshTokenParams) error {
	return f.err
}

func (f fakeRepo) GetRefreshTokenByHash(_ context.Context, _ string) (repo.RefreshToken, error) {
	return f.refresh, f.err
}

func (f fakeRepo) RevokeRefreshTokenByID(_ context.Context, _ string, _ time.Time) error {
	return f.err
}

func (f fakeRepo) RevokeRefreshTokenByHash(_ context.Context, _ string, _ time.Time) error {
	return f.err
}

func (f fakeRepo) CleanupRefreshTokens(_ context.Context, _ time.Time, _ time.Time) (repo.CleanupRefreshTokensResult, error) {
	return repo.CleanupRefreshTokensResult{}, f.err
}

type staticClock struct {
	now time.Time
}

func (s staticClock) Now() time.Time {
	return s.now
}

func TestGetMeValidatesEmail(t *testing.T) {
	svc := NewService(fakeRepo{}, "test-secret", staticClock{now: time.Unix(0, 0).UTC()})

	_, err := svc.GetMe(context.Background(), "   ")
	require.ErrorIs(t, err, ErrEmailRequired)
}

func TestGetMeNormalizesEmail(t *testing.T) {
	var usedEmail string
	expected := domain.AuthSubject{UserID: "u1", Email: "me@example.com"}
	svc := NewService(fakeRepo{subject: expected, email: &usedEmail}, "test-secret", staticClock{now: time.Unix(0, 0).UTC()})

	got, err := svc.GetMe(context.Background(), " ME@EXAMPLE.COM ")
	require.NoError(t, err)
	require.Equal(t, expected, got)
	require.Equal(t, "me@example.com", usedEmail)
}

func TestRegisterValidatesPasswordLength(t *testing.T) {
	svc := NewService(fakeRepo{}, "test-secret", staticClock{now: time.Unix(0, 0).UTC()})

	_, err := svc.Register(context.Background(), "user@example.com", "short")
	require.ErrorIs(t, err, ErrPasswordTooShort)
}

func TestRefreshRequiresToken(t *testing.T) {
	svc := NewService(fakeRepo{}, "test-secret", staticClock{now: time.Unix(0, 0).UTC()})

	_, err := svc.Refresh(context.Background(), "")
	require.ErrorIs(t, err, ErrRefreshTokenRequired)
}
