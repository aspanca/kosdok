package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/kosdok/backend/internal/auth/domain"
	authservice "github.com/kosdok/backend/internal/auth/service"
	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/transport/httpapi/authapi"
	"github.com/kosdok/backend/internal/transport/httpapi/mapper"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
)

type AuthHandler struct {
	config  config.Config
	service *authservice.Service
}

func NewAuthHandler(cfg config.Config, service *authservice.Service) *AuthHandler {
	return &AuthHandler{config: cfg, service: service}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var payload authapi.LoginRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		respond.JSON(w, http.StatusBadRequest, mapper.ToErrorResponse("invalid_request", "Malformed JSON request body."))
		return
	}

	email := strings.TrimSpace(string(payload.Email))
	password := strings.TrimSpace(payload.Password)
	if email == "" || password == "" {
		respond.JSON(w, http.StatusBadRequest, mapper.ToErrorResponse("invalid_request", "Email and password are required."))
		return
	}

	setRefreshCookie(w, h.config, "dummy-refresh-token")

	respond.JSON(w, http.StatusOK, authapi.LoginResponse{
		AccessToken: "dummy-access-token",
		TokenType:   "Bearer",
		ExpiresIn:   900,
	})
}

func (h *AuthHandler) GetAuthMe(w http.ResponseWriter, r *http.Request, params authapi.GetAuthMeParams) {
	subject, err := h.service.GetMe(r.Context(), string(params.XUserEmail))
	if err != nil {
		switch {
		case errors.Is(err, authservice.ErrEmailRequired):
			respond.JSON(w, http.StatusBadRequest, mapper.ToErrorResponse("invalid_request", "Email header is required."))
		case errors.Is(err, domain.ErrUserNotFound):
			respond.JSON(w, http.StatusNotFound, mapper.ToErrorResponse("not_found", "User not found."))
		default:
			respond.JSON(w, http.StatusInternalServerError, mapper.ToErrorResponse("internal_error", "Internal server error."))
		}
		return
	}

	respond.JSON(w, http.StatusOK, mapper.ToAuthMeResponse(subject))
}

func setRefreshCookie(w http.ResponseWriter, cfg config.Config, token string) {
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
