package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	authservice "github.com/kosdok/backend/internal/auth/service"
	"github.com/stretchr/testify/require"
)

var testJWTValidationConfig = JWTValidationConfig{
	Secret:   "test-secret",
	Issuer:   "test-issuer",
	Audience: "test-audience",
	Leeway:   5 * time.Second,
}

func TestEnforceRouteAccess_TemplatePathMatching(t *testing.T) {
	rules := []RouteAccessRule{
		{
			Method:              http.MethodGet,
			Path:                "/v1/patients/{id}",
			RequireAuth:         true,
			RequiredPermissions: []string{"patient:read"},
			PermissionMode:      PermissionMatchAll,
		},
	}

	finalHandler := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	handler := JWTClaims(testJWTValidationConfig)(EnforceRouteAccess(rules)(finalHandler))

	req := httptest.NewRequest(http.MethodGet, "/v1/patients/abc-123", nil)
	req.Header.Set("Authorization", "Bearer "+signAccessToken(t, "usr_1", "u@example.com", []string{"patient"}, []string{"patient:read"}))
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	require.Equal(t, http.StatusOK, rec.Code)
}

func TestEnforceRouteAccess_RegexPathMatching(t *testing.T) {
	rules := []RouteAccessRule{
		{
			Method:              http.MethodGet,
			PathRegex:           `^/v1/reports/[0-9]{4}/[0-9]{2}$`,
			RequireAuth:         true,
			RequiredPermissions: []string{"report:read"},
			PermissionMode:      PermissionMatchAll,
		},
	}

	finalHandler := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	handler := JWTClaims(testJWTValidationConfig)(EnforceRouteAccess(rules)(finalHandler))

	req := httptest.NewRequest(http.MethodGet, "/v1/reports/2026/02", nil)
	req.Header.Set("Authorization", "Bearer "+signAccessToken(t, "usr_2", "u2@example.com", []string{"admin"}, []string{"report:read"}))
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	require.Equal(t, http.StatusOK, rec.Code)
}

func TestRequireAnyPermission_AllowsOnePermission(t *testing.T) {
	finalHandler := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	handler := JWTClaims(testJWTValidationConfig)(RequireAnyPermission("patient:write", "patient:read")(finalHandler))

	req := httptest.NewRequest(http.MethodGet, "/any", nil)
	req.Header.Set("Authorization", "Bearer "+signAccessToken(t, "usr_3", "u3@example.com", []string{"patient"}, []string{"patient:read"}))
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	require.Equal(t, http.StatusOK, rec.Code)
}

func TestRequirePermission_DeniesMissingPermission(t *testing.T) {
	finalHandler := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	handler := JWTClaims(testJWTValidationConfig)(RequirePermission("patient:write")(finalHandler))

	req := httptest.NewRequest(http.MethodGet, "/any", nil)
	req.Header.Set("Authorization", "Bearer "+signAccessToken(t, "usr_4", "u4@example.com", []string{"patient"}, []string{"patient:read"}))
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	require.Equal(t, http.StatusForbidden, rec.Code)

	var response map[string]any
	err := json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Equal(t, "forbidden", response["code"])
}

func TestRequireAuth_DeniesMissingToken(t *testing.T) {
	finalHandler := http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})
	handler := JWTClaims(testJWTValidationConfig)(RequireAuth()(finalHandler))

	req := httptest.NewRequest(http.MethodGet, "/any", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	require.Equal(t, http.StatusUnauthorized, rec.Code)
}

func signAccessToken(t *testing.T, userID string, email string, roles []string, permissions []string) string {
	t.Helper()

	now := time.Now().UTC()
	claims := authservice.AccessTokenClaims{
		Email:       email,
		Roles:       roles,
		Permissions: permissions,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    testJWTValidationConfig.Issuer,
			Subject:   userID,
			Audience:  jwt.ClaimStrings{testJWTValidationConfig.Audience},
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(15 * time.Minute)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte("test-secret"))
	require.NoError(t, err)

	return signed
}
