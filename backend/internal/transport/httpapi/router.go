package httpapi

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/kosdok/backend/internal/auth"
	"github.com/kosdok/backend/internal/middleware"
	platformclock "github.com/kosdok/backend/internal/platform/clock"
	"github.com/kosdok/backend/internal/platform/config"
	platformlog "github.com/kosdok/backend/internal/platform/log"
	authtransport "github.com/kosdok/backend/internal/transport/httpapi/auth"
	authhandler "github.com/kosdok/backend/internal/transport/httpapi/auth/handler"
	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
	oapimiddleware "github.com/oapi-codegen/nethttp-middleware"
)

const apiV1BasePath = "/v1"

func NewRouter(cfg config.Config, dbConn *sql.DB) (http.Handler, error) {
	cfg = withRouterDefaults(cfg)

	r := chi.NewRouter()
	v1Router := chi.NewRouter()
	logger := platformlog.New()

	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(middleware.Recover(logger))
	r.Use(middleware.Logging(logger))

	v1Router.Use(chimw.Timeout(60 * time.Second))
	v1Router.Use(middleware.NewRouteRateLimiter([]middleware.RouteRateLimitRule{
		{Method: http.MethodPost, Path: apiV1BasePath + "/auth/login", RequestsPerMinute: cfg.AuthLoginRateLimitPerMinute, Burst: 3},
		{Method: http.MethodPost, Path: apiV1BasePath + "/auth/register", RequestsPerMinute: cfg.AuthRegisterRateLimitPerMinute, Burst: 2},
	}))
	v1Router.Use(middleware.JWTClaims(middleware.JWTValidationConfig{
		Secret:   cfg.JWTSecret,
		Issuer:   cfg.JWTIssuer,
		Audience: cfg.JWTAudience,
		Leeway:   time.Duration(cfg.JWTLeewaySeconds) * time.Second,
	}))
	v1Router.Use(middleware.CSRFCookieProtection(middleware.CSRFCookieConfig{
		TrustedOrigins: cfg.TrustedOrigins,
		ProtectedRoutes: []middleware.RouteAccessRule{
			{Method: http.MethodPost, Path: apiV1BasePath + "/auth/refresh"},
			{Method: http.MethodPost, Path: apiV1BasePath + "/auth/logout"},
		},
	}))
	v1Router.Use(middleware.EnforceRouteAccess(authtransport.RouteAccessRules(apiV1BasePath)))

	r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		respond.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	authModule := auth.NewModule(dbConn, cfg, platformclock.RealClock{})
	auditLogger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	authHandler := authhandler.NewAuthHandler(cfg, authModule.Service, auditLogger)
	strictAuthHandler := authapi.NewStrictHandlerWithOptions(
		authHandler,
		[]authapi.StrictMiddlewareFunc{authhandler.RequestContextStrictMiddleware},
		authapi.StrictHTTPServerOptions{
			RequestErrorHandlerFunc: func(w http.ResponseWriter, _ *http.Request, _ error) {
				respond.Error(w, http.StatusBadRequest, "invalid_request", "Malformed JSON request body.")
			},
			ResponseErrorHandlerFunc: func(w http.ResponseWriter, _ *http.Request, _ error) {
				respond.Error(w, http.StatusInternalServerError, "internal_error", "Internal server error.")
			},
		},
	)

	swagger, err := authapi.GetSwagger()
	if err != nil {
		return nil, fmt.Errorf("load auth swagger: %w", err)
	}
	swagger.Servers = openapi3.Servers{{URL: apiV1BasePath}}
	v1Router.Use(oapimiddleware.OapiRequestValidatorWithOptions(swagger, &oapimiddleware.Options{
		SilenceServersWarning: true,
		Options: openapi3filter.Options{
			AuthenticationFunc: openapi3filter.NoopAuthenticationFunc,
		},
		ErrorHandlerWithOpts: func(_ context.Context, _ error, w http.ResponseWriter, _ *http.Request, opts oapimiddleware.ErrorHandlerOpts) {
			switch opts.StatusCode {
			case http.StatusUnauthorized:
				respond.Error(w, http.StatusUnauthorized, "unauthorized", "Access token is missing or invalid.")
			default:
				respond.Error(w, http.StatusBadRequest, "invalid_request", "Invalid request parameters.")
			}
		},
	}))

	authapi.HandlerWithOptions(strictAuthHandler, authapi.ChiServerOptions{
		BaseRouter: v1Router,
		BaseURL:    "",
		ErrorHandlerFunc: func(w http.ResponseWriter, _ *http.Request, _ error) {
			respond.Error(w, http.StatusBadRequest, "invalid_request", "Invalid request parameters.")
		},
	})
	if err := swagger.Validate(context.Background()); err != nil {
		return nil, fmt.Errorf("validate auth swagger: %w", err)
	}

	r.Mount(apiV1BasePath, v1Router)

	return r, nil
}

func withRouterDefaults(cfg config.Config) config.Config {
	defaults := config.Load()

	if cfg.JWTSecret == "" {
		cfg.JWTSecret = defaults.JWTSecret
	}
	if cfg.JWTIssuer == "" {
		cfg.JWTIssuer = defaults.JWTIssuer
	}
	if cfg.JWTAudience == "" {
		cfg.JWTAudience = defaults.JWTAudience
	}
	if cfg.JWTLeewaySeconds == 0 {
		cfg.JWTLeewaySeconds = defaults.JWTLeewaySeconds
	}
	if cfg.AuthLoginRateLimitPerMinute == 0 {
		cfg.AuthLoginRateLimitPerMinute = defaults.AuthLoginRateLimitPerMinute
	}
	if cfg.AuthRegisterRateLimitPerMinute == 0 {
		cfg.AuthRegisterRateLimitPerMinute = defaults.AuthRegisterRateLimitPerMinute
	}

	return cfg
}
