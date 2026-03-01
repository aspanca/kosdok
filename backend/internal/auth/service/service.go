package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/kosdok/backend/internal/auth/domain"
	"github.com/kosdok/backend/internal/auth/repo"
	platformclock "github.com/kosdok/backend/internal/platform/clock"
	"golang.org/x/crypto/argon2"
)

var (
	ErrEmailRequired        = errors.New("email is required")
	ErrUserIDRequired       = errors.New("user id is required")
	ErrPasswordRequired     = errors.New("password is required")
	ErrPasswordTooShort     = errors.New("password must be at least 8 characters")
	ErrInvalidCredentials   = errors.New("invalid credentials")
	ErrRefreshTokenRequired = errors.New("refresh token is required")
	ErrInvalidRefreshToken  = errors.New("invalid refresh token")
)

const (
	defaultAccessTokenTTL  = 15 * time.Minute
	defaultRefreshTokenTTL = 7 * 24 * time.Hour
)

type RegisterResult struct {
	UserID string
	Email  string
	Roles  []string
}

type LoginResult struct {
	AccessToken  string
	TokenType    string
	ExpiresIn    int32
	RefreshToken string
}

type AccessTokenClaims struct {
	Email       string   `json:"email"`
	Roles       []string `json:"roles"`
	Permissions []string `json:"permissions"`
	jwt.RegisteredClaims
}

type Service struct {
	repo            repo.Repository
	jwtSecret       []byte
	jwtIssuer       string
	jwtAudience     string
	clock           platformclock.Clock
	accessTokenTTL  time.Duration
	refreshTokenTTL time.Duration
}

func NewService(r repo.Repository, jwtSecret string, jwtIssuer string, jwtAudience string, clk platformclock.Clock) *Service {
	if clk == nil {
		clk = platformclock.RealClock{}
	}

	return &Service{
		repo:            r,
		jwtSecret:       []byte(strings.TrimSpace(jwtSecret)),
		jwtIssuer:       strings.TrimSpace(jwtIssuer),
		jwtAudience:     strings.TrimSpace(jwtAudience),
		clock:           clk,
		accessTokenTTL:  defaultAccessTokenTTL,
		refreshTokenTTL: defaultRefreshTokenTTL,
	}
}

func (s *Service) GetMe(ctx context.Context, email string) (domain.AuthSubject, error) {
	normalized := strings.TrimSpace(strings.ToLower(email))
	if normalized == "" {
		return domain.AuthSubject{}, ErrEmailRequired
	}

	return s.repo.GetAuthSubjectByEmail(ctx, normalized)
}

func (s *Service) GetMeByUserID(ctx context.Context, userID string) (domain.AuthSubject, error) {
	normalized := strings.TrimSpace(userID)
	if normalized == "" {
		return domain.AuthSubject{}, ErrUserIDRequired
	}

	return s.repo.GetAuthSubjectByUserID(ctx, normalized)
}

func (s *Service) Register(ctx context.Context, email string, password string) (RegisterResult, error) {
	normalizedEmail, err := normalizeEmail(email)
	if err != nil {
		return RegisterResult{}, err
	}

	if err := validatePassword(password); err != nil {
		return RegisterResult{}, err
	}

	passwordHash, err := hashPassword(password)
	if err != nil {
		return RegisterResult{}, fmt.Errorf("hash password: %w", err)
	}

	now := s.clock.Now().UTC()
	userID := "usr_" + uuid.NewString()

	err = s.repo.CreateUserWithRole(ctx, repo.CreateUserWithRoleParams{
		UserID:       userID,
		Email:        normalizedEmail,
		PasswordHash: passwordHash,
		RoleName:     repo.DefaultRolePatient,
		Now:          now,
	})
	if err != nil {
		return RegisterResult{}, err
	}

	return RegisterResult{
		UserID: userID,
		Email:  normalizedEmail,
		Roles:  []string{repo.DefaultRolePatient},
	}, nil
}

func (s *Service) Login(ctx context.Context, email string, password string) (LoginResult, error) {
	normalizedEmail, err := normalizeEmail(email)
	if err != nil {
		return LoginResult{}, err
	}

	if strings.TrimSpace(password) == "" {
		return LoginResult{}, ErrPasswordRequired
	}

	credentials, err := s.repo.GetUserCredentialsByEmail(ctx, normalizedEmail)
	if err != nil {
		if errors.Is(err, domain.ErrUserNotFound) {
			return LoginResult{}, ErrInvalidCredentials
		}
		return LoginResult{}, err
	}

	validPassword, err := verifyPassword(credentials.PasswordHash, password)
	if err != nil {
		return LoginResult{}, err
	}
	if !validPassword {
		return LoginResult{}, ErrInvalidCredentials
	}

	subject, err := s.repo.GetAuthSubjectByEmail(ctx, normalizedEmail)
	if err != nil {
		return LoginResult{}, err
	}

	now := s.clock.Now().UTC()
	accessToken, expiresAt, err := s.signAccessToken(subject, now)
	if err != nil {
		return LoginResult{}, err
	}

	refreshTokenPlain, refreshTokenHash, err := generateRefreshToken()
	if err != nil {
		return LoginResult{}, err
	}

	err = s.repo.CreateRefreshToken(ctx, repo.CreateRefreshTokenParams{
		TokenID:   "rt_" + uuid.NewString(),
		UserID:    subject.UserID,
		TokenHash: refreshTokenHash,
		ExpiresAt: now.Add(s.refreshTokenTTL),
		CreatedAt: now,
	})
	if err != nil {
		return LoginResult{}, err
	}

	return LoginResult{
		AccessToken:  accessToken,
		TokenType:    "Bearer",
		ExpiresIn:    int32(time.Until(expiresAt).Seconds()),
		RefreshToken: refreshTokenPlain,
	}, nil
}

func (s *Service) Refresh(ctx context.Context, refreshToken string) (LoginResult, error) {
	refreshToken = strings.TrimSpace(refreshToken)
	if refreshToken == "" {
		return LoginResult{}, ErrRefreshTokenRequired
	}

	now := s.clock.Now().UTC()
	refreshTokenHash := hashRefreshToken(refreshToken)
	storedToken, err := s.repo.GetRefreshTokenByHash(ctx, refreshTokenHash)
	if err != nil {
		if errors.Is(err, domain.ErrRefreshTokenInvalid) {
			return LoginResult{}, ErrInvalidRefreshToken
		}
		return LoginResult{}, err
	}

	if storedToken.RevokedAt != nil || !storedToken.ExpiresAt.After(now) {
		return LoginResult{}, ErrInvalidRefreshToken
	}

	subject, err := s.repo.GetAuthSubjectByUserID(ctx, storedToken.UserID)
	if err != nil {
		return LoginResult{}, err
	}

	accessToken, expiresAt, err := s.signAccessToken(subject, now)
	if err != nil {
		return LoginResult{}, err
	}

	newRefreshTokenPlain, newRefreshTokenHash, err := generateRefreshToken()
	if err != nil {
		return LoginResult{}, err
	}

	err = s.repo.RevokeRefreshTokenByID(ctx, storedToken.TokenID, now)
	if err != nil {
		if errors.Is(err, domain.ErrRefreshTokenInvalid) {
			return LoginResult{}, ErrInvalidRefreshToken
		}
		return LoginResult{}, err
	}

	err = s.repo.CreateRefreshToken(ctx, repo.CreateRefreshTokenParams{
		TokenID:   "rt_" + uuid.NewString(),
		UserID:    subject.UserID,
		TokenHash: newRefreshTokenHash,
		ExpiresAt: now.Add(s.refreshTokenTTL),
		CreatedAt: now,
	})
	if err != nil {
		return LoginResult{}, err
	}

	return LoginResult{
		AccessToken:  accessToken,
		TokenType:    "Bearer",
		ExpiresIn:    int32(time.Until(expiresAt).Seconds()),
		RefreshToken: newRefreshTokenPlain,
	}, nil
}

func (s *Service) Logout(ctx context.Context, refreshToken string) error {
	refreshToken = strings.TrimSpace(refreshToken)
	if refreshToken == "" {
		return nil
	}

	hash := hashRefreshToken(refreshToken)
	err := s.repo.RevokeRefreshTokenByHash(ctx, hash, s.clock.Now().UTC())
	if err != nil && !errors.Is(err, domain.ErrRefreshTokenInvalid) {
		return err
	}

	return nil
}

func (s *Service) signAccessToken(subject domain.AuthSubject, now time.Time) (string, time.Time, error) {
	expiresAt := now.Add(s.accessTokenTTL)
	claims := AccessTokenClaims{
		Email:       subject.Email,
		Roles:       subject.Roles,
		Permissions: subject.Permissions,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.jwtIssuer,
			Subject:   subject.UserID,
			Audience:  jwt.ClaimStrings{s.jwtAudience},
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			ID:        "at_" + uuid.NewString(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("sign access token: %w", err)
	}

	return signed, expiresAt, nil
}

func normalizeEmail(email string) (string, error) {
	normalized := strings.TrimSpace(strings.ToLower(email))
	if normalized == "" {
		return "", ErrEmailRequired
	}

	return normalized, nil
}

func validatePassword(password string) error {
	trimmed := strings.TrimSpace(password)
	if trimmed == "" {
		return ErrPasswordRequired
	}
	if len(trimmed) < 8 {
		return ErrPasswordTooShort
	}

	return nil
}

func hashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("generate salt: %w", err)
	}

	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	encodedSalt := base64.RawStdEncoding.EncodeToString(salt)
	encodedHash := base64.RawStdEncoding.EncodeToString(hash)

	return fmt.Sprintf("$argon2id$v=19$m=65536,t=1,p=4$%s$%s", encodedSalt, encodedHash), nil
}

func verifyPassword(encodedHash string, password string) (bool, error) {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false, fmt.Errorf("invalid password hash format")
	}

	var memory uint32
	var iterations uint32
	var parallelism uint8
	if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &memory, &iterations, &parallelism); err != nil {
		return false, fmt.Errorf("invalid argon2 params: %w", err)
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, fmt.Errorf("decode salt: %w", err)
	}

	decodedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, fmt.Errorf("decode hash: %w", err)
	}

	computedHash := argon2.IDKey([]byte(password), salt, iterations, memory, parallelism, uint32(len(decodedHash)))
	return subtle.ConstantTimeCompare(decodedHash, computedHash) == 1, nil
}

func generateRefreshToken() (plain string, hashed string, err error) {
	randomBytes := make([]byte, 32)
	if _, err = rand.Read(randomBytes); err != nil {
		return "", "", fmt.Errorf("generate refresh token: %w", err)
	}

	plain = base64.RawURLEncoding.EncodeToString(randomBytes)
	hashed = hashRefreshToken(plain)

	return plain, hashed, nil
}

func hashRefreshToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}
