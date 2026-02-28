APP_NAME := api
DB_PATH ?= ./data/app.db

.PHONY: run test generate-openapi generate-openapi-auth generate-openapi-all generate-sqlc migrate-up

run:
	go run ./cmd/api

test:
	go test ./...

generate-openapi: generate-openapi-auth

generate-sqlc:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@v1.30.0 generate

migrate-up:
	migrate -database "sqlite3://$(DB_PATH)" -path migrations up
