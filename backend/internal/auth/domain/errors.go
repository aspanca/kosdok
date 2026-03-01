package domain

import "errors"

var (
	ErrUserNotFound        = errors.New("user not found")
	ErrEmailAlreadyExists  = errors.New("email already exists")
	ErrRefreshTokenInvalid = errors.New("refresh token is invalid")
)
