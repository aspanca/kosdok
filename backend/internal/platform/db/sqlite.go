package db

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	_ "modernc.org/sqlite"
)

type SQLiteOptions struct {
	Path            string
	JournalMode     string
	SynchronousMode string
	BusyTimeoutMS   int
	ForeignKeysOn   bool
}

func defaultSQLiteOptions(path string) SQLiteOptions {
	return SQLiteOptions{
		Path:            path,
		JournalMode:     "WAL",
		SynchronousMode: "NORMAL",
		BusyTimeoutMS:   5000,
		ForeignKeysOn:   true,
	}
}

func NewSQLite(path string) (*sql.DB, error) {
	return NewSQLiteWithOptions(defaultSQLiteOptions(path))
}

func NewSQLiteWithOptions(opts SQLiteOptions) (*sql.DB, error) {
	if opts.Path == "" {
		return nil, errors.New("db path is required")
	}

	if err := validateSQLiteOptions(opts); err != nil {
		return nil, err
	}

	if err := os.MkdirAll(filepath.Dir(opts.Path), 0o755); err != nil {
		return nil, fmt.Errorf("create db dir: %w", err)
	}

	db, err := sql.Open("sqlite", opts.Path)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}

	if err := applySQLitePragmas(db, opts); err != nil {
		db.Close()
		return nil, err
	}

	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("ping sqlite: %w", err)
	}

	return db, nil
}

func applySQLitePragmas(db *sql.DB, opts SQLiteOptions) error {
	journalMode := strings.ToUpper(strings.TrimSpace(opts.JournalMode))
	synchronous := strings.ToUpper(strings.TrimSpace(opts.SynchronousMode))
	foreignKeys := "OFF"
	if opts.ForeignKeysOn {
		foreignKeys = "ON"
	}

	pragmas := []string{
		fmt.Sprintf("PRAGMA journal_mode=%s;", journalMode),
		fmt.Sprintf("PRAGMA synchronous=%s;", synchronous),
		fmt.Sprintf("PRAGMA busy_timeout=%d;", opts.BusyTimeoutMS),
		fmt.Sprintf("PRAGMA foreign_keys=%s;", foreignKeys),
	}

	for _, stmt := range pragmas {
		if _, err := db.Exec(stmt); err != nil {
			return fmt.Errorf("apply sqlite pragma %q: %w", stmt, err)
		}
	}

	return nil
}

func validateSQLiteOptions(opts SQLiteOptions) error {
	if opts.BusyTimeoutMS < 0 {
		return errors.New("sqlite busy timeout must be >= 0")
	}

	journalMode := strings.ToUpper(strings.TrimSpace(opts.JournalMode))
	if !isAllowed(journalMode, map[string]struct{}{
		"DELETE":   {},
		"TRUNCATE": {},
		"PERSIST":  {},
		"MEMORY":   {},
		"WAL":      {},
		"OFF":      {},
	}) {
		return fmt.Errorf("invalid sqlite journal mode: %q", opts.JournalMode)
	}

	synchronousMode := strings.ToUpper(strings.TrimSpace(opts.SynchronousMode))
	if !isAllowed(synchronousMode, map[string]struct{}{
		"OFF":    {},
		"NORMAL": {},
		"FULL":   {},
		"EXTRA":  {},
	}) {
		return fmt.Errorf("invalid sqlite synchronous mode: %q", opts.SynchronousMode)
	}

	return nil
}

func isAllowed(value string, allowed map[string]struct{}) bool {
	_, ok := allowed[value]
	return ok
}
