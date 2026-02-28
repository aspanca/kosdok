package handler

import (
	"errors"
	"net/http"

	"github.com/kosdok/backend/internal/auth/domain"
	authservice "github.com/kosdok/backend/internal/auth/service"
	"github.com/kosdok/backend/internal/transport/httpapi/auth/mapper"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
)

type authErrorRule struct {
	match   func(error) bool
	status  int
	code    string
	message string
}

var registerErrorRules = []authErrorRule{
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrEmailRequired) },
		status:  http.StatusBadRequest,
		code:    "invalid_request",
		message: "Email is required.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrPasswordRequired) },
		status:  http.StatusBadRequest,
		code:    "invalid_request",
		message: "Password is required.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrPasswordTooShort) },
		status:  http.StatusBadRequest,
		code:    "invalid_request",
		message: "Password must be at least 8 characters.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, domain.ErrEmailAlreadyExists) },
		status:  http.StatusConflict,
		code:    "email_exists",
		message: "Email is already registered.",
	},
}

var loginErrorRules = []authErrorRule{
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrEmailRequired) },
		status:  http.StatusBadRequest,
		code:    "invalid_request",
		message: "Email is required.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrPasswordRequired) },
		status:  http.StatusBadRequest,
		code:    "invalid_request",
		message: "Password is required.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrInvalidCredentials) },
		status:  http.StatusUnauthorized,
		code:    "invalid_credentials",
		message: "Email or password is incorrect.",
	},
}

var authMeErrorRules = []authErrorRule{
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrUserIDRequired) },
		status:  http.StatusBadRequest,
		code:    "invalid_request",
		message: "User id is required.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, domain.ErrUserNotFound) },
		status:  http.StatusNotFound,
		code:    "not_found",
		message: "User not found.",
	},
}

var refreshErrorRules = []authErrorRule{
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrRefreshTokenRequired) },
		status:  http.StatusUnauthorized,
		code:    "invalid_refresh_token",
		message: "Refresh token is required.",
	},
	{
		match:   func(err error) bool { return errors.Is(err, authservice.ErrInvalidRefreshToken) },
		status:  http.StatusUnauthorized,
		code:    "invalid_refresh_token",
		message: "Refresh token is invalid or expired.",
	},
}

func writeMalformedJSONError(w http.ResponseWriter) {
	respond.JSON(w, http.StatusBadRequest, mapper.ToErrorResponse("invalid_request", "Malformed JSON request body."))
}

func writeRegisterError(w http.ResponseWriter, err error) {
	writeMappedError(w, err, registerErrorRules)
}

func writeLoginError(w http.ResponseWriter, err error) {
	writeMappedError(w, err, loginErrorRules)
}

func writeAuthMeError(w http.ResponseWriter, err error) {
	writeMappedError(w, err, authMeErrorRules)
}

func writeRefreshError(w http.ResponseWriter, err error) {
	writeMappedError(w, err, refreshErrorRules)
}

func writeMappedError(w http.ResponseWriter, err error, rules []authErrorRule) {
	for _, rule := range rules {
		if rule.match(err) {
			respond.JSON(w, rule.status, mapper.ToErrorResponse(rule.code, rule.message))
			return
		}
	}

	respond.JSON(w, http.StatusInternalServerError, mapper.ToErrorResponse("internal_error", "Internal server error."))
}

func classifyAuthError(err error) string {
	if err == nil {
		return ""
	}

	for _, ruleSet := range [][]authErrorRule{registerErrorRules, loginErrorRules, authMeErrorRules, refreshErrorRules} {
		for _, rule := range ruleSet {
			if rule.match(err) {
				return rule.code
			}
		}
	}

	return "internal_error"
}
