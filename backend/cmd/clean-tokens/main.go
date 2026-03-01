package main

import (
	"context"
	"log"
	"time"

	"github.com/kosdok/backend/internal/auth/repo"
	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/platform/db"
)

func main() {
	cfg := config.Load()

	dbConn, err := db.NewSQLiteWithOptions(db.SQLiteOptions{
		Path:            cfg.DBPath,
		JournalMode:     cfg.SQLiteJournalMode,
		SynchronousMode: cfg.SQLiteSynchronous,
		BusyTimeoutMS:   cfg.SQLiteBusyTimeoutMS,
		ForeignKeysOn:   cfg.SQLiteForeignKeysOn,
	})
	if err != nil {
		log.Fatalf("open sqlite: %v", err)
	}
	defer dbConn.Close()

	if err := db.ApplyMigrationsFromDir(context.Background(), dbConn, "./migrations"); err != nil {
		log.Fatalf("apply migrations: %v", err)
	}

	authRepo := repo.NewSQLiteRepository(dbConn)
	now := time.Now().UTC()
	revokedBefore := now.Add(-time.Duration(cfg.RefreshTokenRevokedRetentionDays) * 24 * time.Hour)

	result, err := authRepo.CleanupRefreshTokens(context.Background(), now, revokedBefore)
	if err != nil {
		log.Fatalf("cleanup refresh tokens: %v", err)
	}

	log.Printf("refresh token cleanup complete expired_deleted=%d revoked_deleted=%d retention_days=%d", result.ExpiredDeleted, result.RevokedDeleted, cfg.RefreshTokenRevokedRetentionDays)
}
