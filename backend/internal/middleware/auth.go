package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrMissingAuthorizationHeader = errors.New("authorization header is missing")
	ErrInvalidAuthorizationHeader = errors.New("authorization header is invalid")
	ErrInvalidAccessToken         = errors.New("access token is invalid")
)

type AuthClaims struct {
	UserID      string
	Email       string
	Roles       []string
	Permissions []string
}

type contextKey string

const (
	authClaimsContextKey contextKey = "auth_claims"
	authErrorContextKey  contextKey = "auth_error"
	defaultJWTSecret                = "dev-change-me"
)

func JWTClaims(secret string) func(nextHandler http.Handler) http.Handler {
	secret = strings.TrimSpace(secret)
	if secret == "" {
		secret = defaultJWTSecret
	}

	return func(nextHandler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
			if authHeader == "" {
				nextHandler.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), authErrorContextKey, ErrMissingAuthorizationHeader)))
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" {
				nextHandler.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), authErrorContextKey, ErrInvalidAuthorizationHeader)))
				return
			}

			rawToken := strings.TrimSpace(parts[1])
			claims := jwt.MapClaims{}
			token, err := jwt.ParseWithClaims(rawToken, claims, func(token *jwt.Token) (interface{}, error) {
				if token.Method != jwt.SigningMethodHS256 {
					return nil, ErrInvalidAccessToken
				}
				return []byte(secret), nil
			})
			if err != nil || token == nil || !token.Valid {
				nextHandler.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), authErrorContextKey, ErrInvalidAccessToken)))
				return
			}

			authClaims, claimsErr := mapJWTClaims(claims)
			if claimsErr != nil {
				nextHandler.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), authErrorContextKey, ErrInvalidAccessToken)))
				return
			}

			ctx := context.WithValue(r.Context(), authClaimsContextKey, authClaims)
			ctx = context.WithValue(ctx, authErrorContextKey, nil)
			nextHandler.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func ClaimsFromContext(ctx context.Context) (AuthClaims, bool) {
	claims, ok := ctx.Value(authClaimsContextKey).(AuthClaims)
	if !ok {
		return AuthClaims{}, false
	}

	return claims, true
}

func AuthErrorFromContext(ctx context.Context) error {
	err, _ := ctx.Value(authErrorContextKey).(error)
	return err
}

func mapJWTClaims(claims jwt.MapClaims) (AuthClaims, error) {
	userID, ok := claims["sub"].(string)
	if !ok || strings.TrimSpace(userID) == "" {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	email, ok := claims["email"].(string)
	if !ok || strings.TrimSpace(email) == "" {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	roles, err := toStringSlice(claims["roles"])
	if err != nil {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	permissions, err := toStringSlice(claims["permissions"])
	if err != nil {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	return AuthClaims{
		UserID:      userID,
		Email:       email,
		Roles:       roles,
		Permissions: permissions,
	}, nil
}

func toStringSlice(value any) ([]string, error) {
	if value == nil {
		return nil, nil
	}

	items, ok := value.([]any)
	if !ok {
		return nil, ErrInvalidAccessToken
	}

	out := make([]string, 0, len(items))
	for _, item := range items {
		asString, isString := item.(string)
		if !isString {
			return nil, ErrInvalidAccessToken
		}
		out = append(out, asString)
	}

	return out, nil
}
