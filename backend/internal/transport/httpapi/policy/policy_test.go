package policy

import (
	"net/http"
	"testing"

	"github.com/kosdok/backend/internal/middleware"
)

func TestBuildDerivesRuleSets(t *testing.T) {
	bundle := Build([]RouteSpec{
		{Method: http.MethodGet, Path: "/v1/public"},
		{
			Method:              http.MethodGet,
			Path:                "/v1/private",
			RequireAuth:         true,
			RequiredPermissions: []string{"patient:read"},
			PermissionMode:      middleware.PermissionMatchAll,
		},
		{
			Method: http.MethodPost,
			Path:   "/v1/auth/login",
			RateLimit: &RateLimitPolicy{
				RequestsPerMinute: 10,
				Burst:             2,
			},
		},
		{Method: http.MethodPost, Path: "/v1/auth/logout", RequireCSRFCookieOrigin: true},
	})

	if len(bundle.AccessRules) != 1 {
		t.Fatalf("AccessRules len = %d, want %d", len(bundle.AccessRules), 1)
	}
	if len(bundle.RateLimitRules) != 1 {
		t.Fatalf("RateLimitRules len = %d, want %d", len(bundle.RateLimitRules), 1)
	}
	if len(bundle.CSRFProtectedRoutes) != 1 {
		t.Fatalf("CSRFProtectedRoutes len = %d, want %d", len(bundle.CSRFProtectedRoutes), 1)
	}
}

func TestMergeCombinesBundles(t *testing.T) {
	a := Build([]RouteSpec{{Method: http.MethodGet, Path: "/v1/a", RequireAuth: true}})
	b := Build([]RouteSpec{{Method: http.MethodPost, Path: "/v1/b", RequireCSRFCookieOrigin: true}})

	out := Merge(a, b)

	if len(out.AccessRules) != 1 {
		t.Fatalf("AccessRules len = %d, want %d", len(out.AccessRules), 1)
	}
	if len(out.CSRFProtectedRoutes) != 1 {
		t.Fatalf("CSRFProtectedRoutes len = %d, want %d", len(out.CSRFProtectedRoutes), 1)
	}
}
