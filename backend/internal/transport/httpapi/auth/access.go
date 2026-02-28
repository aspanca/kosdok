package auth

import (
	"net/http"

	"github.com/kosdok/backend/internal/middleware"
	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/transport/httpapi/policy"
)

func RouteSpecs(basePath string, cfg config.Config) []policy.RouteSpec {
	return []policy.RouteSpec{
		{
			Method: http.MethodPost,
			Path:   basePath + "/auth/register",
			RateLimit: &policy.RateLimitPolicy{
				RequestsPerMinute: cfg.AuthRegisterRateLimitPerMinute,
				Burst:             2,
			},
		},
		{
			Method: http.MethodPost,
			Path:   basePath + "/auth/login",
			RateLimit: &policy.RateLimitPolicy{
				RequestsPerMinute: cfg.AuthLoginRateLimitPerMinute,
				Burst:             3,
			},
		},
		{
			Method:                  http.MethodPost,
			Path:                    basePath + "/auth/refresh",
			RequireCSRFCookieOrigin: true,
		},
		{
			Method:                  http.MethodPost,
			Path:                    basePath + "/auth/logout",
			RequireAuth:             true,
			RequireCSRFCookieOrigin: true,
		},
		{
			Method:              http.MethodGet,
			Path:                basePath + "/auth/me",
			RequireAuth:         true,
			RequiredPermissions: []string{"auth:me:read"},
			PermissionMode:      middleware.PermissionMatchAll,
		},
	}
}
