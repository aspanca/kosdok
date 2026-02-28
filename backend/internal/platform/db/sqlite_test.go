package db

import (
	"path/filepath"
	"testing"
)

func TestNewSQLiteWithOptionsAppliesPragmas(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "app.db")

	dbConn, err := NewSQLiteWithOptions(SQLiteOptions{
		Path:            dbPath,
		JournalMode:     "WAL",
		SynchronousMode: "NORMAL",
		BusyTimeoutMS:   7000,
		ForeignKeysOn:   true,
	})
	if err != nil {
		t.Fatalf("NewSQLiteWithOptions() error = %v", err)
	}
	t.Cleanup(func() {
		_ = dbConn.Close()
	})

	var journalMode string
	if err := dbConn.QueryRow("PRAGMA journal_mode;").Scan(&journalMode); err != nil {
		t.Fatalf("query journal_mode: %v", err)
	}
	if journalMode != "wal" {
		t.Fatalf("journal_mode = %q, want %q", journalMode, "wal")
	}

	var busyTimeout int
	if err := dbConn.QueryRow("PRAGMA busy_timeout;").Scan(&busyTimeout); err != nil {
		t.Fatalf("query busy_timeout: %v", err)
	}
	if busyTimeout != 7000 {
		t.Fatalf("busy_timeout = %d, want %d", busyTimeout, 7000)
	}

	var foreignKeys int
	if err := dbConn.QueryRow("PRAGMA foreign_keys;").Scan(&foreignKeys); err != nil {
		t.Fatalf("query foreign_keys: %v", err)
	}
	if foreignKeys != 1 {
		t.Fatalf("foreign_keys = %d, want %d", foreignKeys, 1)
	}
}

func TestNewSQLiteWithOptionsRejectsInvalidModes(t *testing.T) {
	dbPath := filepath.Join(t.TempDir(), "app.db")

	_, err := NewSQLiteWithOptions(SQLiteOptions{
		Path:            dbPath,
		JournalMode:     "INVALID",
		SynchronousMode: "NORMAL",
		BusyTimeoutMS:   5000,
		ForeignKeysOn:   true,
	})
	if err == nil {
		t.Fatal("expected invalid journal mode error")
	}

	_, err = NewSQLiteWithOptions(SQLiteOptions{
		Path:            dbPath,
		JournalMode:     "WAL",
		SynchronousMode: "BROKEN",
		BusyTimeoutMS:   5000,
		ForeignKeysOn:   true,
	})
	if err == nil {
		t.Fatal("expected invalid synchronous mode error")
	}

	_, err = NewSQLiteWithOptions(SQLiteOptions{
		Path:            dbPath,
		JournalMode:     "WAL",
		SynchronousMode: "NORMAL",
		BusyTimeoutMS:   -1,
		ForeignKeysOn:   true,
	})
	if err == nil {
		t.Fatal("expected invalid busy timeout error")
	}
}
