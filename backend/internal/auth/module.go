package auth

import (
	"database/sql"

	"github.com/kosdok/backend/internal/auth/repo"
	authservice "github.com/kosdok/backend/internal/auth/service"
)

type Module struct {
	Service *authservice.Service
}

func NewModule(dbConn *sql.DB) Module {
	authRepo := repo.NewSQLiteRepository(dbConn)
	authService := authservice.NewService(authRepo)

	return Module{Service: authService}
}
