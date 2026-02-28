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
	"testing"

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

func TestLoginSetsRefreshCookie(t *testing.T) {
	dbConn := newTestDB(t)
	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

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
	require.Equal(t, "dummy-access-token", response["access_token"])
	require.Equal(t, "Bearer", response["token_type"])
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
	seedAuthTestData(t, dbConn)

	r, err := httpapi.NewRouter(config.Config{Env: "development"}, dbConn)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodGet, "/v1/auth/me", nil)
	req.Header.Set("X-User-Email", "me@example.com")
	rec := httptest.NewRecorder()
	r.ServeHTTP(rec, req)

	require.Equal(t, http.StatusOK, rec.Code)

	var response map[string]any
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Equal(t, "usr_me", response["user_id"])
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

	require.Equal(t, http.StatusBadRequest, rec.Code)
	require.Equal(t, "application/json", rec.Header().Get("Content-Type"))

	var response map[string]any
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)
	require.Equal(t, "invalid_request", response["code"])
	require.NotEmpty(t, response["message"])
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

func seedAuthTestData(t *testing.T, dbConn *sql.DB) {
	t.Helper()

	seedSQL := []string{
		`INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES ('usr_me', 'me@example.com', NULL, '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z');`,
		`INSERT INTO user_roles (user_id, role_id) SELECT 'usr_me', id FROM roles WHERE name = 'patient';`,
	}

	for _, stmt := range seedSQL {
		_, err := dbConn.Exec(stmt)
		require.NoError(t, err)
	}
}
