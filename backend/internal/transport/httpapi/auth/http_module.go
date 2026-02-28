package auth

import (
	"database/sql"
	"log/slog"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
	authcore "github.com/kosdok/backend/internal/auth"
	platformclock "github.com/kosdok/backend/internal/platform/clock"
	"github.com/kosdok/backend/internal/platform/config"
	authhandler "github.com/kosdok/backend/internal/transport/httpapi/auth/handler"
	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
	"github.com/kosdok/backend/internal/transport/httpapi/openapiutil"
	"github.com/kosdok/backend/internal/transport/httpapi/policy"
)

type HTTPModule struct {
	Name       string
	RouteSpecs func(basePath string, cfg config.Config) []policy.RouteSpec
	Swagger    func() (*openapi3.T, error)
	Register   func(basePath string, router chi.Router) error
}

func NewHTTPModule(cfg config.Config, dbConn *sql.DB, auditLogger *slog.Logger) HTTPModule {
	return HTTPModule{
		Name:       "auth",
		RouteSpecs: RouteSpecs,
		Swagger:    authapi.GetSwagger,
		Register: func(basePath string, router chi.Router) error {
			return registerHTTPRoutes(basePath, router, cfg, dbConn, auditLogger)
		},
	}
}

func registerHTTPRoutes(_ string, router chi.Router, cfg config.Config, dbConn *sql.DB, auditLogger *slog.Logger) error {
	authModule := authcore.NewModule(dbConn, cfg, platformclock.RealClock{})
	authHandler := authhandler.NewAuthHandler(cfg, authModule.Service, auditLogger)
	strictAuthHandler := authapi.NewStrictHandlerWithOptions(
		authHandler,
		[]authapi.StrictMiddlewareFunc{authhandler.RequestContextStrictMiddleware},
		authapi.StrictHTTPServerOptions{
			RequestErrorHandlerFunc:  openapiutil.StrictRequestErrorHandler,
			ResponseErrorHandlerFunc: openapiutil.StrictResponseErrorHandler,
		},
	)

	authapi.HandlerWithOptions(strictAuthHandler, authapi.ChiServerOptions{
		BaseRouter:       router,
		BaseURL:          "",
		ErrorHandlerFunc: openapiutil.RouteParamErrorHandler,
	})

	return nil
}
