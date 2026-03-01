package main

import (
	"context"
	"log"

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

	log.Printf("migrations applied successfully")
}
