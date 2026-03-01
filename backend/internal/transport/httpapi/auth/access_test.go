package auth

import (
	"net/http"
	"testing"

	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/transport/httpapi/policy"
)

func TestBuildRoutePoliciesDerivesRulesFromRouteSpecs(t *testing.T) {
	cfg := config.Config{
		AuthLoginRateLimitPerMinute:    10,
		AuthRegisterRateLimitPerMinute: 5,
	}

	policies := policy.Build(RouteSpecs("/v1", cfg))

	if len(policies.AccessRules) != 2 {
		t.Fatalf("AccessRules len = %d, want %d", len(policies.AccessRules), 2)
	}
	if len(policies.RateLimitRules) != 2 {
		t.Fatalf("RateLimitRules len = %d, want %d", len(policies.RateLimitRules), 2)
	}
	if len(policies.CSRFProtectedRoutes) != 2 {
		t.Fatalf("CSRFProtectedRoutes len = %d, want %d", len(policies.CSRFProtectedRoutes), 2)
	}

	if !hasAccessRule(policies, http.MethodGet, "/v1/auth/me") {
		t.Fatal("missing access rule for GET /v1/auth/me")
	}
	if !hasAccessRule(policies, http.MethodPost, "/v1/auth/logout") {
		t.Fatal("missing access rule for POST /v1/auth/logout")
	}

	if !hasRateLimitRule(policies, http.MethodPost, "/v1/auth/login", 10, 3) {
		t.Fatal("missing expected rate-limit rule for POST /v1/auth/login")
	}
	if !hasRateLimitRule(policies, http.MethodPost, "/v1/auth/register", 5, 2) {
		t.Fatal("missing expected rate-limit rule for POST /v1/auth/register")
	}

	if !hasCSRFRoute(policies, http.MethodPost, "/v1/auth/refresh") {
		t.Fatal("missing csrf protected route for POST /v1/auth/refresh")
	}
	if !hasCSRFRoute(policies, http.MethodPost, "/v1/auth/logout") {
		t.Fatal("missing csrf protected route for POST /v1/auth/logout")
	}
}

func hasAccessRule(policies policy.Bundle, method string, path string) bool {
	for _, rule := range policies.AccessRules {
		if rule.Method == method && rule.Path == path {
			return true
		}
	}

	return false
}

func hasRateLimitRule(policies policy.Bundle, method string, path string, requestsPerMinute int, burst int) bool {
	for _, rule := range policies.RateLimitRules {
		if rule.Method == method && rule.Path == path && rule.RequestsPerMinute == requestsPerMinute && rule.Burst == burst {
			return true
		}
	}

	return false
}

func hasCSRFRoute(policies policy.Bundle, method string, path string) bool {
	for _, route := range policies.CSRFProtectedRoutes {
		if route.Method == method && route.Path == path {
			return true
		}
	}

	return false
}
