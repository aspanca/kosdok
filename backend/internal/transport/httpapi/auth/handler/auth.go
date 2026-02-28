package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	authservice "github.com/kosdok/backend/internal/auth/service"
	"github.com/kosdok/backend/internal/platform/config"
	"github.com/kosdok/backend/internal/transport/httpapi/auth/mapper"
	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
)

type AuthHandler struct {
	config  config.Config
	service *authservice.Service
}

func NewAuthHandler(cfg config.Config, service *authservice.Service) *AuthHandler {
	return &AuthHandler{config: cfg, service: service}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var payload authapi.RegisterRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		writeMalformedJSONError(w)
		return
	}

	result, err := h.service.Register(r.Context(), string(payload.Email), payload.Password)
	if err != nil {
		writeRegisterError(w, err)
		return
	}

	respond.JSON(w, http.StatusCreated, mapper.ToRegisterResponse(result))
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var payload authapi.LoginRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		writeMalformedJSONError(w)
		return
	}

	result, err := h.service.Login(r.Context(), string(payload.Email), payload.Password)
	if err != nil {
		writeLoginError(w, err)
		return
	}

	setRefreshCookie(w, h.config, result.RefreshToken)
	respond.JSON(w, http.StatusOK, mapper.ToLoginResponse(result))
}

func (h *AuthHandler) GetAuthMe(w http.ResponseWriter, r *http.Request, params authapi.GetAuthMeParams) {
	subject, err := h.service.GetMe(r.Context(), string(params.XUserEmail))
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
