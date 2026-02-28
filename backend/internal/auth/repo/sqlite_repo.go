package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/kosdok/backend/internal/auth/domain"
	authdb "github.com/kosdok/backend/internal/auth/repo/sqlc/gen"
)

type SQLiteRepository struct {
	db      *sql.DB
	queries *authdb.Queries
}

func NewSQLiteRepository(db *sql.DB) *SQLiteRepository {
	return &SQLiteRepository{db: db, queries: authdb.New(db)}
}

func (r *SQLiteRepository) GetAuthSubjectByEmail(ctx context.Context, email string) (domain.AuthSubject, error) {
	user, err := r.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return domain.AuthSubject{}, mapQueryError(err)
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

func (r *SQLiteRepository) GetUserCredentialsByEmail(ctx context.Context, email string) (UserCredentials, error) {
	row, err := r.queries.GetUserCredentialsByEmail(ctx, email)
	if err != nil {
		return UserCredentials{}, mapQueryError(err)
	}

	if !row.PasswordHash.Valid || strings.TrimSpace(row.PasswordHash.String) == "" {
		return UserCredentials{}, domain.ErrUserNotFound
	}

	return UserCredentials{
		UserID:       row.ID,
		Email:        row.Email,
		PasswordHash: row.PasswordHash.String,
	}, nil
}

func (r *SQLiteRepository) CreateUserWithRole(ctx context.Context, params CreateUserWithRoleParams) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}

	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	queriesTx := r.queries.WithTx(tx)

	err = queriesTx.CreateUser(ctx, authdb.CreateUserParams{
		ID:           params.UserID,
		Email:        params.Email,
		PasswordHash: sql.NullString{String: params.PasswordHash, Valid: true},
		CreatedAt:    params.Now.UTC().Format(timeLayoutRFC3339),
		UpdatedAt:    params.Now.UTC().Format(timeLayoutRFC3339),
	})
	if err != nil {
		return mapQueryError(err)
	}

	roleID, err := queriesTx.GetRoleIDByName(ctx, params.RoleName)
	if err != nil {
		return mapQueryError(err)
	}

	err = queriesTx.AddUserRole(ctx, authdb.AddUserRoleParams{
		UserID: params.UserID,
		RoleID: roleID,
	})
	if err != nil {
		return mapQueryError(err)
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("commit tx: %w", err)
	}

	return nil
}

func (r *SQLiteRepository) CreateRefreshToken(ctx context.Context, params CreateRefreshTokenParams) error {
	err := r.queries.CreateRefreshToken(ctx, authdb.CreateRefreshTokenParams{
		ID:        params.TokenID,
		UserID:    params.UserID,
		TokenHash: params.TokenHash,
		ExpiresAt: params.ExpiresAt.UTC().Format(timeLayoutRFC3339),
		CreatedAt: params.CreatedAt.UTC().Format(timeLayoutRFC3339),
	})
	if err != nil {
		return mapQueryError(err)
	}

	return nil
}

const timeLayoutRFC3339 = "2006-01-02T15:04:05Z07:00"

func mapQueryError(err error) error {
	if errors.Is(err, sql.ErrNoRows) {
		return domain.ErrUserNotFound
	}

	if strings.Contains(err.Error(), "UNIQUE constraint failed: users.email") {
		return domain.ErrEmailAlreadyExists
	}

	return err
}
