package handler

import (
	"context"
	"net/http"

	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
)

type strictContextKey string

const requestContextKey strictContextKey = "strict_request"

func RequestContextStrictMiddleware(next authapi.StrictHandlerFunc, _ string) authapi.StrictHandlerFunc {
	return func(ctx context.Context, w http.ResponseWriter, r *http.Request, request interface{}) (interface{}, error) {
		ctx = context.WithValue(ctx, requestContextKey, r)
		return next(ctx, w, r, request)
	}
}

func requestFromContext(ctx context.Context) *http.Request {
	r, _ := ctx.Value(requestContextKey).(*http.Request)
	return r
}
