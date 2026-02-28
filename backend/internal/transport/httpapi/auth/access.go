package auth

import (
	"net/http"

	"github.com/kosdok/backend/internal/middleware"
)

func RouteAccessRules(basePath string) []middleware.RouteAccessRule {
	return []middleware.RouteAccessRule{
		{
			Method:              http.MethodGet,
			Path:                basePath + "/auth/me",
			RequireAuth:         true,
			RequiredPermissions: []string{"auth:me:read"},
			PermissionMode:      middleware.PermissionMatchAll,
		},
		{
			Method:      http.MethodPost,
			Path:        basePath + "/auth/logout",
			RequireAuth: true,
		},
	}
}
