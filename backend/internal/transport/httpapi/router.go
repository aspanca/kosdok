package httpapi

import (
	"database/sql"
	"fmt"
	stdlog "log"
	"net/http"
	"time"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/kosdok/backend/internal/middleware"
	"github.com/kosdok/backend/internal/platform/config"
	platformlog "github.com/kosdok/backend/internal/platform/log"
	"github.com/kosdok/backend/internal/transport/httpapi/openapiutil"
	"github.com/kosdok/backend/internal/transport/httpapi/policy"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
)

const apiV1BasePath = "/v1"

type v1Module struct {
	name       string
	routeSpecs func(basePath string, cfg config.Config) []policy.RouteSpec
	swagger    func() (*openapi3.T, error)
	register   func(basePath string, router chi.Router) error
}

func NewRouter(cfg config.Config, dbConn *sql.DB) (http.Handler, error) {
	cfg = withRouterDefaults(cfg)

	logger := platformlog.New()
	modules := registeredV1Modules(cfg, dbConn)
	v1Policies := buildV1Policies(modules, apiV1BasePath, cfg)

	r := newRootRouter(logger)
	v1Router := chi.NewRouter()
	applyV1Middleware(v1Router, cfg, v1Policies)
	registerHealthRoute(r)
	if err := installV1RequestValidator(v1Router, modules, apiV1BasePath); err != nil {
		return nil, err
	}

	if err := registerV1Modules(v1Router, modules, apiV1BasePath); err != nil {
		return nil, err
	}

	r.Mount(apiV1BasePath, v1Router)

	return r, nil
}

func newRootRouter(logger *stdlog.Logger) *chi.Mux {
	r := chi.NewRouter()

	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(middleware.Recover(logger))
	r.Use(middleware.Logging(logger))

	return r
}

func registerHealthRoute(router chi.Router) {
	router.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		respond.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
}

func applyV1Middleware(v1Router chi.Router, cfg config.Config, v1Policies policy.Bundle) {
	v1Router.Use(chimw.Timeout(60 * time.Second))
	v1Router.Use(middleware.NewRouteRateLimiter(v1Policies.RateLimitRules))
	v1Router.Use(middleware.JWTClaims(middleware.JWTValidationConfig{
		Secret:   cfg.JWTSecret,
		Issuer:   cfg.JWTIssuer,
		Audience: cfg.JWTAudience,
		Leeway:   time.Duration(cfg.JWTLeewaySeconds) * time.Second,
	}))
	v1Router.Use(middleware.CSRFCookieProtection(middleware.CSRFCookieConfig{
		TrustedOrigins:  cfg.TrustedOrigins,
		ProtectedRoutes: v1Policies.CSRFProtectedRoutes,
	}))
	v1Router.Use(middleware.EnforceRouteAccess(v1Policies.AccessRules))
}

func installV1RequestValidator(router chi.Router, modules []v1Module, basePath string) error {
	loaders := make([]openapiutil.SwaggerLoader, 0, len(modules))
	for _, module := range modules {
		if module.swagger != nil {
			loaders = append(loaders, module.swagger)
		}
	}

	mergedSwagger, err := openapiutil.LoadAndMerge(basePath, loaders...)
	if err != nil {
		return fmt.Errorf("build merged openapi spec: %w", err)
	}

	if err := openapiutil.InstallRequestValidator(router, mergedSwagger); err != nil {
		return fmt.Errorf("install openapi request validator: %w", err)
	}

	return nil
}

func buildV1Policies(modules []v1Module, basePath string, cfg config.Config) policy.Bundle {
	bundles := make([]policy.Bundle, 0, len(modules))
	for _, module := range modules {
		bundles = append(bundles, policy.Build(module.routeSpecs(basePath, cfg)))
	}

	return policy.Merge(bundles...)
}

func registerV1Modules(router chi.Router, modules []v1Module, basePath string) error {
	for _, module := range modules {
		if err := module.register(basePath, router); err != nil {
			return fmt.Errorf("register %s module: %w", module.name, err)
		}
	}

	return nil
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
