package config

import "testing"

func TestAddress(t *testing.T) {
	cfg := Config{Port: "9999"}
	if got := cfg.Address(); got != ":9999" {
		t.Fatalf("Address() = %s, want %s", got, ":9999")
	}
}

func TestLoadSQLiteDefaults(t *testing.T) {
	t.Setenv("PORT", "")
	t.Setenv("ENV", "")
	t.Setenv("DB_PATH", "")
	t.Setenv("JWT_SECRET", "")
	t.Setenv("SQLITE_JOURNAL_MODE", "")
	t.Setenv("SQLITE_SYNCHRONOUS", "")
	t.Setenv("SQLITE_BUSY_TIMEOUT_MS", "")
	t.Setenv("SQLITE_FOREIGN_KEYS", "")

	cfg := Load()

	if cfg.SQLiteJournalMode != "WAL" {
		t.Fatalf("SQLiteJournalMode = %q, want %q", cfg.SQLiteJournalMode, "WAL")
	}
	if cfg.SQLiteSynchronous != "NORMAL" {
		t.Fatalf("SQLiteSynchronous = %q, want %q", cfg.SQLiteSynchronous, "NORMAL")
	}
	if cfg.SQLiteBusyTimeoutMS != 5000 {
		t.Fatalf("SQLiteBusyTimeoutMS = %d, want %d", cfg.SQLiteBusyTimeoutMS, 5000)
	}
	if !cfg.SQLiteForeignKeysOn {
		t.Fatalf("SQLiteForeignKeysOn = %t, want %t", cfg.SQLiteForeignKeysOn, true)
	}
}

func TestLoadSQLiteFromEnv(t *testing.T) {
	t.Setenv("SQLITE_JOURNAL_MODE", "DELETE")
	t.Setenv("SQLITE_SYNCHRONOUS", "FULL")
	t.Setenv("SQLITE_BUSY_TIMEOUT_MS", "7500")
	t.Setenv("SQLITE_FOREIGN_KEYS", "false")

	cfg := Load()

	if cfg.SQLiteJournalMode != "DELETE" {
		t.Fatalf("SQLiteJournalMode = %q, want %q", cfg.SQLiteJournalMode, "DELETE")
	}
	if cfg.SQLiteSynchronous != "FULL" {
		t.Fatalf("SQLiteSynchronous = %q, want %q", cfg.SQLiteSynchronous, "FULL")
	}
	if cfg.SQLiteBusyTimeoutMS != 7500 {
		t.Fatalf("SQLiteBusyTimeoutMS = %d, want %d", cfg.SQLiteBusyTimeoutMS, 7500)
	}
	if cfg.SQLiteForeignKeysOn {
		t.Fatalf("SQLiteForeignKeysOn = %t, want %t", cfg.SQLiteForeignKeysOn, false)
	}
}
