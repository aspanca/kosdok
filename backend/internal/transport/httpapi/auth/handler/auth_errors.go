package handler

import (
	"errors"

	"github.com/kosdok/backend/internal/auth/domain"
	authservice "github.com/kosdok/backend/internal/auth/service"
	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
)

func mapRegisterError(err error) (authapi.RegisterResponseObject, bool) {
	switch {
	case errors.Is(err, authservice.ErrEmailRequired):
		return authapi.Register400JSONResponse{Code: "invalid_request", Message: "Email is required."}, true
	case errors.Is(err, authservice.ErrPasswordRequired):
		return authapi.Register400JSONResponse{Code: "invalid_request", Message: "Password is required."}, true
	case errors.Is(err, authservice.ErrPasswordTooShort):
		return authapi.Register400JSONResponse{Code: "invalid_request", Message: "Password must be at least 8 characters."}, true
	case errors.Is(err, domain.ErrEmailAlreadyExists):
		return authapi.Register409JSONResponse{Code: "email_exists", Message: "Email is already registered."}, true
	default:
		return nil, false
	}
}

func mapLoginError(err error) (authapi.LoginResponseObject, bool) {
	switch {
	case errors.Is(err, authservice.ErrEmailRequired):
		return authapi.Login400JSONResponse{Code: "invalid_request", Message: "Email is required."}, true
	case errors.Is(err, authservice.ErrPasswordRequired):
		return authapi.Login400JSONResponse{Code: "invalid_request", Message: "Password is required."}, true
	case errors.Is(err, authservice.ErrInvalidCredentials):
		return authapi.Login401JSONResponse{Code: "invalid_credentials", Message: "Email or password is incorrect."}, true
	default:
		return nil, false
	}
}

func mapAuthMeError(err error) (authapi.GetAuthMeResponseObject, bool) {
	switch {
	case errors.Is(err, authservice.ErrUserIDRequired):
		return authapi.GetAuthMe401JSONResponse{Code: "unauthorized", Message: "Access token is missing or invalid."}, true
	case errors.Is(err, domain.ErrUserNotFound):
		return authapi.GetAuthMe404JSONResponse{Code: "not_found", Message: "User not found."}, true
	default:
		return nil, false
	}
}

func mapRefreshError(err error) (authapi.RefreshResponseObject, bool) {
	switch {
	case errors.Is(err, authservice.ErrRefreshTokenRequired):
		return authapi.Refresh401JSONResponse{Code: "invalid_refresh_token", Message: "Refresh token is required."}, true
	case errors.Is(err, authservice.ErrInvalidRefreshToken):
		return authapi.Refresh401JSONResponse{Code: "invalid_refresh_token", Message: "Refresh token is invalid or expired."}, true
	default:
		return nil, false
	}
}

func malformedJSONErrorResponse() authapi.ErrorResponse {
	return authapi.ErrorResponse{Code: "invalid_request", Message: "Malformed JSON request body."}
}

func classifyAuthError(err error) string {
	switch {
	case errors.Is(err, authservice.ErrEmailRequired):
		return "invalid_request"
	case errors.Is(err, authservice.ErrUserIDRequired):
		return "invalid_request"
	case errors.Is(err, authservice.ErrPasswordRequired):
		return "invalid_request"
	case errors.Is(err, authservice.ErrPasswordTooShort):
		return "invalid_request"
	case errors.Is(err, authservice.ErrInvalidCredentials):
		return "invalid_credentials"
	case errors.Is(err, domain.ErrEmailAlreadyExists):
		return "email_exists"
	case errors.Is(err, authservice.ErrRefreshTokenRequired), errors.Is(err, authservice.ErrInvalidRefreshToken):
		return "invalid_refresh_token"
	default:
		return "internal_error"
	}
}
