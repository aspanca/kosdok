package httpapi_test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/platform/db"
	"github.com/kosdok/backend/internal/transport/httpapi"
	"github.com/stretchr/testify/require"
)

func TestHealthEndpoint(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Load(), dbConn)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)
	require.JSONEq(t, `{"status":"ok"}`, rec.Body.String())
}

func TestRegisterAndLoginSetsRefreshCookie(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	registerPayload := map[string]string{
		"email":    "user@example.com",
		"password": "password123",
	}
	registerBody, err := json.Marshal(registerPayload)
	require.NoError(t, err)

	registerReq := httptest.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewReader(registerBody))
	registerReq.Header.Set("Content-Type", "application/json")
	registerRec := httptest.NewRecorder()
	r.ServeHTTP(registerRec, registerReq)
	require.Equal(t, http.StatusCreated, registerRec.Code)

	payload := map[string]string{
		"email":    "user@example.com",
		"password": "password123",
	}
	body, err := json.Marshal(payload)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)
	require.Contains(t, rec.Header().Get("Set-Cookie"), "refresh_token=")
	require.Contains(t, rec.Header().Get("Set-Cookie"), "HttpOnly")
	require.Contains(t, rec.Header().Get("Set-Cookie"), "SameSite=Lax")

	var response map[string]any
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Equal(t, "Bearer", response["token_type"])

	accessToken, ok := response["access_token"].(string)
	require.True(t, ok)
	require.NotEmpty(t, accessToken)
}

func TestRefreshRotatesRefreshToken(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	loginResult := registerAndLogin(t, r, "rotate2@example.com", "password123")
	loginCookieHeader := latestRefreshCookie(loginResult.SetCookies)
	require.NotEmpty(t, loginCookieHeader)

	refreshReq := httptest.NewRequest(http.MethodPost, "/v1/auth/refresh", nil)
	refreshReq.Header.Add("Cookie", loginCookieHeader)
	refreshRec := httptest.NewRecorder()
	r.ServeHTTP(refreshRec, refreshReq)
	require.Equal(t, http.StatusOK, refreshRec.Code)

	newCookieHeader := latestRefreshCookie(refreshRec.Header().Values("Set-Cookie"))
	require.NotEmpty(t, newCookieHeader)
	require.NotEqual(t, loginCookieHeader, newCookieHeader)

	reuseOldReq := httptest.NewRequest(http.MethodPost, "/v1/auth/refresh", nil)
	reuseOldReq.Header.Add("Cookie", loginCookieHeader)
	reuseOldRec := httptest.NewRecorder()
	r.ServeHTTP(reuseOldRec, reuseOldReq)
	require.Equal(t, http.StatusUnauthorized, reuseOldRec.Code)
}

func TestLogoutRevokesRefreshToken(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	loginResult := registerAndLogin(t, r, "logout@example.com", "password123")
	refreshCookie := latestRefreshCookie(loginResult.SetCookies)
	require.NotEmpty(t, refreshCookie)

	logoutReq := httptest.NewRequest(http.MethodPost, "/v1/auth/logout", nil)
	logoutReq.Header.Add("Cookie", refreshCookie)
	logoutReq.Header.Set("Authorization", "Bearer "+loginResult.AccessToken)
	logoutRec := httptest.NewRecorder()
	r.ServeHTTP(logoutRec, logoutReq)
	require.Equal(t, http.StatusNoContent, logoutRec.Code)
	require.Contains(t, logoutRec.Header().Get("Set-Cookie"), "refresh_token=")

	refreshReq := httptest.NewRequest(http.MethodPost, "/v1/auth/refresh", nil)
	refreshReq.Header.Add("Cookie", refreshCookie)
	refreshRec := httptest.NewRecorder()
	r.ServeHTTP(refreshRec, refreshReq)
	require.Equal(t, http.StatusUnauthorized, refreshRec.Code)
}

func TestRegisterDuplicateEmailReturnsConflict(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	payload := map[string]string{
		"email":    "dup@example.com",
		"password": "password123",
	}
	body, err := json.Marshal(payload)
	require.NoError(t, err)

	firstReq := httptest.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewReader(body))
	firstReq.Header.Set("Content-Type", "application/json")
	firstRec := httptest.NewRecorder()
	r.ServeHTTP(firstRec, firstReq)
	require.Equal(t, http.StatusCreated, firstRec.Code)

	secondReq := httptest.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewReader(body))
	secondReq.Header.Set("Content-Type", "application/json")
	secondRec := httptest.NewRecorder()
	r.ServeHTTP(secondRec, secondReq)
	require.Equal(t, http.StatusConflict, secondRec.Code)
}

func TestLoginInvalidJSON(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewBufferString(`{"email":`))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusBadRequest, rec.Code)
	require.Contains(t, rec.Body.String(), "invalid_request")
}

func TestAuthMeReturnsDBData(t *testing.T) {
	dbConn := newTestDB(t)

	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	loginResult := registerAndLogin(t, r, "me@example.com", "password123")

	req := httptest.NewRequest(http.MethodGet, "/v1/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+loginResult.AccessToken)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)

	var response map[string]any
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	userID, ok := response["user_id"].(string)
	require.True(t, ok)
	require.True(t, strings.HasPrefix(userID, "usr_"))
	require.Equal(t, "me@example.com", response["email"])

	roles := response["roles"].([]any)
	require.Contains(t, roles, "patient")

	permissions := response["permissions"].([]any)
	require.Contains(t, permissions, "auth:me:read")
}

func TestAuthMeMissingHeaderReturnsConsistentError(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodGet, "/v1/auth/me", nil)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusUnauthorized, rec.Code)
	require.Equal(t, "application/json", rec.Header().Get("Content-Type"))

	var response map[string]any
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Equal(t, "unauthorized", response["code"])
	require.NotEmpty(t, response["message"])
}

func TestAuthMeForbiddenWithoutPermission(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	token := signTestAccessToken(t, jwt.MapClaims{
		"sub":         "usr_any",
		"email":       "noaccess@example.com",
		"roles":       []string{"patient"},
		"permissions": []string{},
		"iat":         time.Now().Add(-1 * time.Minute).Unix(),
		"nbf":         time.Now().Add(-1 * time.Minute).Unix(),
		"exp":         time.Now().Add(15 * time.Minute).Unix(),
	})

	req := httptest.NewRequest(http.MethodGet, "/v1/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusForbidden, rec.Code)

	var response map[string]any
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Equal(t, "forbidden", response["code"])
}

func TestLogoutRequiresAuthentication(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	loginResult := registerAndLogin(t, r, "logout-auth@example.com", "password123")
	refreshCookie := latestRefreshCookie(loginResult.SetCookies)
	require.NotEmpty(t, refreshCookie)

	req := httptest.NewRequest(http.MethodPost, "/v1/auth/logout", nil)
	req.Header.Add("Cookie", refreshCookie)
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusUnauthorized, rec.Code)
}

func newTestDB(t *testing.T) *sql.DB {
	t.Helper()

	dbPath := filepath.Join(t.TempDir(), "test.db")
	dbConn, err := db.NewSQLite(dbPath)
	require.NoError(t, err)

	t.Cleanup(func() {
		_ = dbConn.Close()
	})

	applyMigrationsFromFiles(t, dbConn)
	return dbConn
}

func applyMigrationsFromFiles(t *testing.T, dbConn *sql.DB) {
	t.Helper()

	_, currentFile, _, ok := runtime.Caller(0)
	require.True(t, ok)

	backendDir := filepath.Clean(filepath.Join(filepath.Dir(currentFile), "..", "..", ".."))
	migrationPattern := filepath.Join(backendDir, "migrations", "*.up.sql")
	migrationFiles, err := filepath.Glob(migrationPattern)
	require.NoError(t, err)
	require.NotEmpty(t, migrationFiles)
	sort.Strings(migrationFiles)

	for _, filePath := range migrationFiles {
		sqlBytes, err := os.ReadFile(filePath)
		require.NoError(t, err)

		_, err = dbConn.Exec(string(sqlBytes))
		require.NoError(t, err)
	}
}

type loginFlowResult struct {
	AccessToken string
	SetCookies  []string
}

func registerAndLogin(t *testing.T, r http.Handler, email string, password string) loginFlowResult {
	t.Helper()

	registerPayload := map[string]string{"email": email, "password": password}
	registerBody, err := json.Marshal(registerPayload)
	require.NoError(t, err)

	registerReq := httptest.NewRequest(http.MethodPost, "/v1/auth/register", bytes.NewReader(registerBody))
	registerReq.Header.Set("Content-Type", "application/json")
	registerRec := httptest.NewRecorder()
	r.ServeHTTP(registerRec, registerReq)
	require.Equal(t, http.StatusCreated, registerRec.Code)

	loginBody, err := json.Marshal(registerPayload)
	require.NoError(t, err)

	loginReq := httptest.NewRequest(http.MethodPost, "/v1/auth/login", bytes.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginRec := httptest.NewRecorder()
	r.ServeHTTP(loginRec, loginReq)
	require.Equal(t, http.StatusOK, loginRec.Code)

	var loginResponse map[string]any
	err = json.Unmarshal(loginRec.Body.Bytes(), &loginResponse)
	require.NoError(t, err)

	accessToken, ok := loginResponse["access_token"].(string)
	require.True(t, ok)
	require.NotEmpty(t, accessToken)

	return loginFlowResult{
		AccessToken: accessToken,
		SetCookies:  loginRec.Header().Values("Set-Cookie"),
	}
}

func latestRefreshCookie(setCookies []string) string {
	for _, value := range setCookies {
		if strings.HasPrefix(value, "refresh_token=") {
			parts := strings.Split(value, ";")
			if len(parts) > 0 {
				return parts[0]
			}
		}
	}

	return ""
}

func signTestAccessToken(t *testing.T, claims jwt.MapClaims) string {
	t.Helper()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte("dev-change-me"))
	require.NoError(t, err)
	return signed
}
