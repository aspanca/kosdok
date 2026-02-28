package mapper

import (
	"github.com/kosdok/backend/internal/auth/domain"
	authservice "github.com/kosdok/backend/internal/auth/service"
	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

func ToRegisterResponse(result authservice.RegisterResult) authapi.RegisterResponse {
	return authapi.RegisterResponse{
		UserId: result.UserID,
		Email:  openapi_types.Email(result.Email),
		Roles:  result.Roles,
	}
}

func ToLoginResponse(result authservice.LoginResult) authapi.LoginResponse {
	return authapi.LoginResponse{
		AccessToken: result.AccessToken,
		TokenType:   result.TokenType,
		ExpiresIn:   result.ExpiresIn,
	}
}

func ToAuthMeResponse(subject domain.AuthSubject) authapi.AuthMeResponse {
	return authapi.AuthMeResponse{
		UserId:      subject.UserID,
		Email:       openapi_types.Email(subject.Email),
		Roles:       subject.Roles,
		Permissions: subject.Permissions,
	}
}

func ToErrorResponse(code string, message string) authapi.ErrorResponse {
	return authapi.ErrorResponse{Code: code, Message: message}
}
