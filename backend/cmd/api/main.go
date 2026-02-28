package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/platform/db"
	httpapi "github.com/kosdok/backend/internal/transport/httpapi"
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

	r, err := httpapi.NewRouter(cfg, dbConn)
	if err != nil {
		log.Fatalf("build router: %v", err)
	}

	srv := &http.Server{
		Addr:         cfg.Address(),
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  30 * time.Second,
	}

	go func() {
		log.Printf("api listening on %s", cfg.Address())
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server failed: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("shutdown failed: %v", err)
	}
}
