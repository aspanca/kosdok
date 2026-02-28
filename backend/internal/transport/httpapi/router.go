package httpapi

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/kosdok/backend/internal/auth"
	"github.com/kosdok/backend/internal/middleware"
	"github.com/kosdok/backend/internal/platform/config"
	platformlog "github.com/kosdok/backend/internal/platform/log"
	"github.com/kosdok/backend/internal/transport/httpapi/authapi"
	"github.com/kosdok/backend/internal/transport/httpapi/handler"
)

const apiV1BasePath = "/v1"

func NewRouter(cfg config.Config, dbConn *sql.DB) (http.Handler, error) {
	r := chi.NewRouter()
	logger := platformlog.New()

	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(middleware.Recover(logger))
	r.Use(middleware.Logging(logger))

	r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	authModule := auth.NewModule(dbConn)
	authHandler := handler.NewAuthHandler(cfg, authModule.Service)
	authapi.HandlerWithOptions(authHandler, authapi.ChiServerOptions{
		BaseRouter: r,
		BaseURL:    apiV1BasePath,
	})

	swagger, err := authapi.GetSwagger()
	if err != nil {
		return nil, fmt.Errorf("load auth swagger: %w", err)
	}
	if err := swagger.Validate(context.Background()); err != nil {
		return nil, fmt.Errorf("validate auth swagger: %w", err)
	}

	return r, nil
}
