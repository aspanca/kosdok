package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	authservice "github.com/kosdok/backend/internal/auth/service"
)

var (
	ErrMissingAuthorizationHeader = errors.New("authorization header is missing")
	ErrInvalidAuthorizationHeader = errors.New("authorization header is invalid")
	ErrInvalidAccessToken         = errors.New("access token is invalid")
)

type JWTValidationConfig struct {
	Secret   string
	Issuer   string
	Audience string
	Leeway   time.Duration
}

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
)

func JWTClaims(cfg JWTValidationConfig) func(nextHandler http.Handler) http.Handler {
	secret := strings.TrimSpace(cfg.Secret)
	issuer := strings.TrimSpace(cfg.Issuer)
	audience := strings.TrimSpace(cfg.Audience)
	leeway := cfg.Leeway
	if leeway < 0 {
		leeway = 0
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

			if secret == "" || issuer == "" || audience == "" {
				nextHandler.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), authErrorContextKey, ErrInvalidAccessToken)))
				return
			}

			rawToken := strings.TrimSpace(parts[1])
			claims := &authservice.AccessTokenClaims{}
			token, err := jwt.ParseWithClaims(
				rawToken,
				claims,
				func(token *jwt.Token) (any, error) {
					return []byte(secret), nil
				},
				jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
				jwt.WithIssuer(issuer),
				jwt.WithAudience(audience),
				jwt.WithExpirationRequired(),
				jwt.WithLeeway(leeway),
			)
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

func mapJWTClaims(claims *authservice.AccessTokenClaims) (AuthClaims, error) {
	if claims == nil {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	userID := strings.TrimSpace(claims.Subject)
	if userID == "" {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	email := strings.TrimSpace(claims.Email)
	if email == "" {
		return AuthClaims{}, ErrInvalidAccessToken
	}

	return AuthClaims{
		UserID:      userID,
		Email:       email,
		Roles:       claims.Roles,
		Permissions: claims.Permissions,
	}, nil
}
