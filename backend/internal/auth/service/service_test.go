package service

import (
	"context"
	"testing"

	"github.com/kosdok/backend/internal/auth/domain"
	"github.com/stretchr/testify/require"
)

type fakeRepo struct {
	subject domain.AuthSubject
	err     error
	email   *string
}

func (f fakeRepo) GetAuthSubjectByEmail(_ context.Context, email string) (domain.AuthSubject, error) {
	if f.email != nil {
		*f.email = email
	}
	return f.subject, f.err
}

func TestGetMeValidatesEmail(t *testing.T) {
	svc := NewService(fakeRepo{})

	_, err := svc.GetMe(context.Background(), "   ")
	require.ErrorIs(t, err, ErrEmailRequired)
}

func TestGetMeNormalizesEmail(t *testing.T) {
	var usedEmail string
	expected := domain.AuthSubject{UserID: "u1", Email: "me@example.com"}
	svc := NewService(fakeRepo{subject: expected, email: &usedEmail})

	got, err := svc.GetMe(context.Background(), " ME@EXAMPLE.COM ")
	require.NoError(t, err)
	require.Equal(t, expected, got)
	require.Equal(t, "me@example.com", usedEmail)
}
