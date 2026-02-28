package auth

import (
	"database/sql"

	"github.com/kosdok/backend/internal/auth/repo"
	authservice "github.com/kosdok/backend/internal/auth/service"
	platformclock "github.com/kosdok/backend/internal/platform/clock"
	"github.com/kosdok/backend/internal/platform/config"
)

type Module struct {
	Service *authservice.Service
}

func NewModule(dbConn *sql.DB, cfg config.Config, clk platformclock.Clock) Module {
	authRepo := repo.NewSQLiteRepository(dbConn)
	authService := authservice.NewService(authRepo, cfg.JWTSecret, clk)

	return Module{Service: authService}
}
