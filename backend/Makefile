APP_NAME := api
DB_PATH ?= ./data/app.db

.PHONY: run test generate-openapi generate-openapi-auth generate-openapi-all generate-sqlc migrate-up clean-tokens

run:
	go run ./cmd/api

test:
	go test ./...

generate-openapi: generate-openapi-auth

generate-openapi-all: generate-openapi-auth

generate-openapi-auth:
	go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.6.0 --config codegen/oapi/auth.yaml api/auth/auth_api.yaml

generate-sqlc:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@v1.30.0 generate

migrate-up:
	DB_PATH=$(DB_PATH) go run ./cmd/migrate

clean-tokens:
	DB_PATH=$(DB_PATH) go run ./cmd/clean-tokens
