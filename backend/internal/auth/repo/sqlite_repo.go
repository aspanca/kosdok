package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

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

	return r.getAuthSubjectByUserID(ctx, user.ID, user.Email)
}

func (r *SQLiteRepository) GetAuthSubjectByUserID(ctx context.Context, userID string) (domain.AuthSubject, error) {
	user, err := r.queries.GetUserByID(ctx, userID)
	if err != nil {
		return domain.AuthSubject{}, mapQueryError(err)
	}

	return r.getAuthSubjectByUserID(ctx, user.ID, user.Email)
}

func (r *SQLiteRepository) getAuthSubjectByUserID(ctx context.Context, userID string, email string) (domain.AuthSubject, error) {
	roles, err := r.queries.GetRolesByUserID(ctx, userID)
	if err != nil {
		return domain.AuthSubject{}, err
	}

	permissions, err := r.queries.GetPermissionsByUserID(ctx, userID)
	if err != nil {
		return domain.AuthSubject{}, err
	}

	return domain.AuthSubject{
		UserID:      userID,
		Email:       email,
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

func (r *SQLiteRepository) GetRefreshTokenByHash(ctx context.Context, tokenHash string) (RefreshToken, error) {
	row, err := r.queries.GetRefreshTokenByHash(ctx, tokenHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return RefreshToken{}, domain.ErrRefreshTokenInvalid
		}
		return RefreshToken{}, err
	}

	expiresAt, err := time.Parse(timeLayoutRFC3339, row.ExpiresAt)
	if err != nil {
		return RefreshToken{}, fmt.Errorf("parse refresh token expires_at: %w", err)
	}

	createdAt, err := time.Parse(timeLayoutRFC3339, row.CreatedAt)
	if err != nil {
		return RefreshToken{}, fmt.Errorf("parse refresh token created_at: %w", err)
	}

	var revokedAt *time.Time
	if row.RevokedAt.Valid {
		parsedRevokedAt, parseErr := time.Parse(timeLayoutRFC3339, row.RevokedAt.String)
		if parseErr != nil {
			return RefreshToken{}, fmt.Errorf("parse refresh token revoked_at: %w", parseErr)
		}
		revokedAt = &parsedRevokedAt
	}

	return RefreshToken{
		TokenID:   row.ID,
		UserID:    row.UserID,
		TokenHash: row.TokenHash,
		ExpiresAt: expiresAt,
		RevokedAt: revokedAt,
		CreatedAt: createdAt,
	}, nil
}

func (r *SQLiteRepository) RevokeRefreshTokenByID(ctx context.Context, tokenID string, revokedAt time.Time) error {
	rowsAffected, err := r.queries.RevokeRefreshTokenByID(ctx, authdb.RevokeRefreshTokenByIDParams{
		RevokedAt: sql.NullString{String: revokedAt.UTC().Format(timeLayoutRFC3339), Valid: true},
		ID:        tokenID,
	})
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return domain.ErrRefreshTokenInvalid
	}

	return nil
}

func (r *SQLiteRepository) RevokeRefreshTokenByHash(ctx context.Context, tokenHash string, revokedAt time.Time) error {
	rowsAffected, err := r.queries.RevokeRefreshTokenByHash(ctx, authdb.RevokeRefreshTokenByHashParams{
		RevokedAt: sql.NullString{String: revokedAt.UTC().Format(timeLayoutRFC3339), Valid: true},
		TokenHash: tokenHash,
	})
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return domain.ErrRefreshTokenInvalid
	}

	return nil
}

func (r *SQLiteRepository) CleanupRefreshTokens(ctx context.Context, now time.Time, revokedBefore time.Time) (CleanupRefreshTokensResult, error) {
	expiredDeleted, err := r.queries.DeleteExpiredRefreshTokens(ctx, now.UTC().Format(timeLayoutRFC3339))
	if err != nil {
		return CleanupRefreshTokensResult{}, err
	}

	revokedDeleted, err := r.queries.DeleteRevokedRefreshTokensBefore(ctx, sql.NullString{String: revokedBefore.UTC().Format(timeLayoutRFC3339), Valid: true})
	if err != nil {
		return CleanupRefreshTokensResult{}, err
	}

	return CleanupRefreshTokensResult{
		ExpiredDeleted: expiredDeleted,
		RevokedDeleted: revokedDeleted,
	}, nil
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
