package repo

import (
	"context"
	"database/sql"
	"errors"

	"github.com/kosdok/backend/internal/auth/domain"
	authdb "github.com/kosdok/backend/internal/auth/repo/sqlc/gen"
)

type SQLiteRepository struct {
	queries *authdb.Queries
}

func NewSQLiteRepository(db *sql.DB) *SQLiteRepository {
	return &SQLiteRepository{queries: authdb.New(db)}
}

func (r *SQLiteRepository) GetAuthSubjectByEmail(ctx context.Context, email string) (domain.AuthSubject, error) {
	user, err := r.queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.AuthSubject{}, domain.ErrUserNotFound
		}
		return domain.AuthSubject{}, err
	}

	roles, err := r.queries.GetRolesByUserID(ctx, user.ID)
	if err != nil {
		return domain.AuthSubject{}, err
	}

	permissions, err := r.queries.GetPermissionsByUserID(ctx, user.ID)
	if err != nil {
		return domain.AuthSubject{}, err
	}

	return domain.AuthSubject{
		UserID:      user.ID,
		Email:       user.Email,
		Roles:       roles,
		Permissions: permissions,
	}, nil
}
