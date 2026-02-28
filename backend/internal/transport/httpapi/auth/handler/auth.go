package handler

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"strings"

	authservice "github.com/kosdok/backend/internal/auth/service"
	transportmiddleware "github.com/kosdok/backend/internal/middleware"
	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/transport/httpapi/auth/mapper"
	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
)

type AuthHandler struct {
	config      config.Config
	service     *authservice.Service
	auditLogger *slog.Logger
}

func NewAuthHandler(cfg config.Config, service *authservice.Service, auditLogger *slog.Logger) *AuthHandler {
	if auditLogger == nil {
		auditLogger = newDefaultAuditLogger()
	}

	return &AuthHandler{config: cfg, service: service, auditLogger: auditLogger}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var payload authapi.RegisterRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "register", Outcome: "failure", Reason: "invalid_json"})
		writeMalformedJSONError(w)
		return
	}

	result, err := h.service.Register(r.Context(), string(payload.Email), payload.Password)
	if err != nil {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "register", Outcome: "failure", Reason: classifyAuthError(err), Email: string(payload.Email)})
		writeRegisterError(w, err)
		return
	}

	logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "register", Outcome: "success", Email: result.Email, UserID: result.UserID})
	respond.JSON(w, http.StatusCreated, mapper.ToRegisterResponse(result))
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var payload authapi.LoginRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "login", Outcome: "failure", Reason: "invalid_json"})
		writeMalformedJSONError(w)
		return
	}

	result, err := h.service.Login(r.Context(), string(payload.Email), payload.Password)
	if err != nil {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "login", Outcome: "failure", Reason: classifyAuthError(err), Email: string(payload.Email)})
		writeLoginError(w, err)
		return
	}

	setRefreshCookie(w, h.config, result.RefreshToken)
	logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "login", Outcome: "success", Email: string(payload.Email)})
	respond.JSON(w, http.StatusOK, mapper.ToLoginResponse(result))
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	refreshToken := getRefreshCookieToken(r)
	result, err := h.service.Refresh(r.Context(), refreshToken)
	if err != nil {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "refresh", Outcome: "failure", Reason: classifyAuthError(err)})
		writeRefreshError(w, err)
		return
	}

	setRefreshCookie(w, h.config, result.RefreshToken)
	logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "refresh", Outcome: "success"})
	respond.JSON(w, http.StatusOK, mapper.ToLoginResponse(result))
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	refreshToken := getRefreshCookieToken(r)
	if err := h.service.Logout(r.Context(), refreshToken); err != nil {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "logout", Outcome: "failure", Reason: classifyAuthError(err)})
		respond.JSON(w, http.StatusInternalServerError, mapper.ToErrorResponse("internal_error", "Internal server error."))
		return
	}

	clearRefreshCookie(w, h.config)
	claims, ok := transportmiddleware.ClaimsFromContext(r.Context())
	if ok {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "logout", Outcome: "success", UserID: claims.UserID, Email: claims.Email})
	} else {
		logAuthEvent(r.Context(), h.auditLogger, r, AuthAuditEvent{Action: "logout", Outcome: "success"})
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *AuthHandler) GetAuthMe(w http.ResponseWriter, r *http.Request) {
	authErr := transportmiddleware.AuthErrorFromContext(r.Context())
	if authErr != nil {
		if errors.Is(authErr, transportmiddleware.ErrMissingAuthorizationHeader) ||
			errors.Is(authErr, transportmiddleware.ErrInvalidAuthorizationHeader) ||
			errors.Is(authErr, transportmiddleware.ErrInvalidAccessToken) {
			respond.JSON(w, http.StatusUnauthorized, mapper.ToErrorResponse("unauthorized", "Access token is missing or invalid."))
			return
		}

		respond.JSON(w, http.StatusUnauthorized, mapper.ToErrorResponse("unauthorized", "Access token is missing or invalid."))
		return
	}

	claims, ok := transportmiddleware.ClaimsFromContext(r.Context())
	if !ok {
		respond.JSON(w, http.StatusUnauthorized, mapper.ToErrorResponse("unauthorized", "Access token is missing or invalid."))
		return
	}

	subject, err := h.service.GetMeByUserID(r.Context(), claims.UserID)
	if err != nil {
		writeAuthMeError(w, err)
		return
	}

	respond.JSON(w, http.StatusOK, mapper.ToAuthMeResponse(subject))
}

func setRefreshCookie(w http.ResponseWriter, cfg config.Config, token string) {
	token = strings.TrimSpace(token)
	if token == "" {
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Env == "production",
		SameSite: http.SameSiteLaxMode,
		MaxAge:   7 * 24 * 60 * 60,
	})
}

func clearRefreshCookie(w http.ResponseWriter, cfg config.Config) {
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Env == "production",
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	})
}

func getRefreshCookieToken(r *http.Request) string {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		return ""
	}

	return strings.TrimSpace(cookie.Value)
}
