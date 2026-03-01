package db

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

const migrationsTableName = "schema_migrations"

func ApplyMigrationsFromDir(ctx context.Context, db *sql.DB, migrationsDir string) error {
	if err := ensureMigrationsTable(ctx, db); err != nil {
		return err
	}

	files, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("read migrations dir: %w", err)
	}

	upFiles := make([]string, 0, len(files))
	for _, file := range files {
		if file.IsDir() {
			continue
		}
		name := file.Name()
		if strings.HasSuffix(name, ".up.sql") {
			upFiles = append(upFiles, name)
		}
	}

	sort.Strings(upFiles)

	for _, fileName := range upFiles {
		applied, err := isMigrationApplied(ctx, db, fileName)
		if err != nil {
			return err
		}
		if applied {
			continue
		}

		path := filepath.Join(migrationsDir, fileName)
		sqlBytes, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("read migration file %s: %w", fileName, err)
		}

		tx, err := db.BeginTx(ctx, nil)
		if err != nil {
			return fmt.Errorf("begin migration tx for %s: %w", fileName, err)
		}

		if _, err := tx.ExecContext(ctx, string(sqlBytes)); err != nil {
			_ = tx.Rollback()
			return fmt.Errorf("apply migration %s: %w", fileName, err)
		}

		if _, err := tx.ExecContext(
			ctx,
			fmt.Sprintf("INSERT INTO %s (name, applied_at) VALUES (?, ?)", migrationsTableName),
			fileName,
			time.Now().UTC().Format(time.RFC3339),
		); err != nil {
			_ = tx.Rollback()
			return fmt.Errorf("mark migration %s as applied: %w", fileName, err)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit migration %s: %w", fileName, err)
		}
	}

	return nil
}

func ensureMigrationsTable(ctx context.Context, db *sql.DB) error {
	query := fmt.Sprintf(`
CREATE TABLE IF NOT EXISTS %s (
	name TEXT PRIMARY KEY,
	applied_at TEXT NOT NULL
);
`, migrationsTableName)
	if _, err := db.ExecContext(ctx, query); err != nil {
		return fmt.Errorf("ensure migrations table: %w", err)
	}

	return nil
}

func isMigrationApplied(ctx context.Context, db *sql.DB, migrationName string) (bool, error) {
	query := fmt.Sprintf("SELECT COUNT(1) FROM %s WHERE name = ?", migrationsTableName)
	var count int
	if err := db.QueryRowContext(ctx, query, migrationName).Scan(&count); err != nil {
		return false, fmt.Errorf("check migration %s: %w", migrationName, err)
	}

	return count > 0, nil
}
