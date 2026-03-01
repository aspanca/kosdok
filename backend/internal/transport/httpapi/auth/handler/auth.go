package handler

import (
	"context"
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

func (h *AuthHandler) Register(ctx context.Context, request authapi.RegisterRequestObject) (authapi.RegisterResponseObject, error) {
	req := requestFromContext(ctx)
	if request.Body == nil {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "register", Outcome: "failure", Reason: "invalid_request"})
		return authapi.Register400JSONResponse{Code: "invalid_request", Message: "Request body is required."}, nil
	}

	result, err := h.service.Register(ctx, string(request.Body.Email), request.Body.Password)
	if err != nil {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "register", Outcome: "failure", Reason: classifyAuthError(err), Email: string(request.Body.Email)})
		if response, ok := mapRegisterError(err); ok {
			return response, nil
		}
		return nil, err
	}

	logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "register", Outcome: "success", Email: result.Email, UserID: result.UserID})
	return authapi.Register201JSONResponse(mapper.ToRegisterResponse(result)), nil
}

func (h *AuthHandler) Login(ctx context.Context, request authapi.LoginRequestObject) (authapi.LoginResponseObject, error) {
	req := requestFromContext(ctx)
	if request.Body == nil {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "login", Outcome: "failure", Reason: "invalid_request"})
		return authapi.Login400JSONResponse{Code: "invalid_request", Message: "Request body is required."}, nil
	}

	result, err := h.service.Login(ctx, string(request.Body.Email), request.Body.Password)
	if err != nil {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "login", Outcome: "failure", Reason: classifyAuthError(err), Email: string(request.Body.Email)})
		if response, ok := mapLoginError(err); ok {
			return response, nil
		}
		return nil, err
	}

	logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "login", Outcome: "success", Email: string(request.Body.Email)})
	return loginResponseWithCookie{payload: mapper.ToLoginResponse(result), cookie: refreshCookie(h.config, result.RefreshToken)}, nil
}

func (h *AuthHandler) Refresh(ctx context.Context, _ authapi.RefreshRequestObject) (authapi.RefreshResponseObject, error) {
	req := requestFromContext(ctx)
	refreshToken := ""
	if req != nil {
		refreshToken = getRefreshCookieToken(req)
	}

	result, err := h.service.Refresh(ctx, refreshToken)
	if err != nil {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "refresh", Outcome: "failure", Reason: classifyAuthError(err)})
		if response, ok := mapRefreshError(err); ok {
			return response, nil
		}
		return nil, err
	}

	logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "refresh", Outcome: "success"})
	return refreshResponseWithCookie{payload: mapper.ToLoginResponse(result), cookie: refreshCookie(h.config, result.RefreshToken)}, nil
}

func (h *AuthHandler) Logout(ctx context.Context, _ authapi.LogoutRequestObject) (authapi.LogoutResponseObject, error) {
	req := requestFromContext(ctx)
	refreshToken := ""
	if req != nil {
		refreshToken = getRefreshCookieToken(req)
	}

	if err := h.service.Logout(ctx, refreshToken); err != nil {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "logout", Outcome: "failure", Reason: classifyAuthError(err)})
		return nil, err
	}

	claims, ok := transportmiddleware.ClaimsFromContext(ctx)
	if ok {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "logout", Outcome: "success", UserID: claims.UserID, Email: claims.Email})
	} else {
		logAuthEvent(ctx, h.auditLogger, req, AuthAuditEvent{Action: "logout", Outcome: "success"})
	}

	return logoutResponseWithCookie{cookie: clearRefreshCookie(h.config)}, nil
}

func (h *AuthHandler) GetAuthMe(ctx context.Context, _ authapi.GetAuthMeRequestObject) (authapi.GetAuthMeResponseObject, error) {
	authErr := transportmiddleware.AuthErrorFromContext(ctx)
	if authErr != nil {
		if errors.Is(authErr, transportmiddleware.ErrMissingAuthorizationHeader) ||
			errors.Is(authErr, transportmiddleware.ErrInvalidAuthorizationHeader) ||
			errors.Is(authErr, transportmiddleware.ErrInvalidAccessToken) {
			return authapi.GetAuthMe401JSONResponse{Code: "unauthorized", Message: "Access token is missing or invalid."}, nil
		}
		return authapi.GetAuthMe401JSONResponse{Code: "unauthorized", Message: "Access token is missing or invalid."}, nil
	}

	claims, ok := transportmiddleware.ClaimsFromContext(ctx)
	if !ok {
		return authapi.GetAuthMe401JSONResponse{Code: "unauthorized", Message: "Access token is missing or invalid."}, nil
	}

	subject, err := h.service.GetMeByUserID(ctx, claims.UserID)
	if err != nil {
		if response, ok := mapAuthMeError(err); ok {
			return response, nil
		}
		return nil, err
	}

	return authapi.GetAuthMe200JSONResponse(mapper.ToAuthMeResponse(subject)), nil
}

type loginResponseWithCookie struct {
	payload authapi.LoginResponse
	cookie  *http.Cookie
}

func (response loginResponseWithCookie) VisitLoginResponse(w http.ResponseWriter) error {
	if response.cookie != nil {
		http.SetCookie(w, response.cookie)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	return json.NewEncoder(w).Encode(response.payload)
}

type refreshResponseWithCookie struct {
	payload authapi.LoginResponse
	cookie  *http.Cookie
}

func (response refreshResponseWithCookie) VisitRefreshResponse(w http.ResponseWriter) error {
	if response.cookie != nil {
		http.SetCookie(w, response.cookie)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	return json.NewEncoder(w).Encode(response.payload)
}

type logoutResponseWithCookie struct {
	cookie *http.Cookie
}

func (response logoutResponseWithCookie) VisitLogoutResponse(w http.ResponseWriter) error {
	if response.cookie != nil {
		http.SetCookie(w, response.cookie)
	}
	w.WriteHeader(http.StatusNoContent)
	return nil
}

func refreshCookie(cfg config.Config, token string) *http.Cookie {
	token = strings.TrimSpace(token)
	if token == "" {
		return nil
	}

	return &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Env == "production",
		SameSite: http.SameSiteLaxMode,
		MaxAge:   7 * 24 * 60 * 60,
	}
}

func clearRefreshCookie(cfg config.Config) *http.Cookie {
	return &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   cfg.Env == "production",
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
	}
}

func getRefreshCookieToken(r *http.Request) string {
	if r == nil {
		return ""
	}
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		return ""
	}

	return strings.TrimSpace(cookie.Value)
}
