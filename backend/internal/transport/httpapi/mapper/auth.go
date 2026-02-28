package mapper

import (
	"github.com/kosdok/backend/internal/auth/domain"
	"github.com/kosdok/backend/internal/transport/httpapi/authapi"
	openapi_types "github.com/oapi-codegen/runtime/types"
)

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
