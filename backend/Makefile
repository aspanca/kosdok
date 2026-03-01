APP_NAME := api
DB_PATH ?= ./data/app.db
OAPI_CODEGEN := github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.6.0

OPENAPI_CONFIG_DIR := codegen/oapi
OPENAPI_CONFIGS := $(wildcard $(OPENAPI_CONFIG_DIR)/*.yaml)
OPENAPI_MODULES := $(sort $(basename $(notdir $(OPENAPI_CONFIGS))))

.PHONY: run test generate-openapi generate-sqlc migrate-up clean-tokens

run:
	go run ./cmd/api

test:
	go test ./...

generate-openapi: $(addprefix generate-openapi-,$(OPENAPI_MODULES))

generate-openapi-%:
	@if [ ! -f "$(OPENAPI_CONFIG_DIR)/$*.yaml" ]; then \
		echo "Missing OpenAPI config: $(OPENAPI_CONFIG_DIR)/$*.yaml"; \
		exit 1; \
	fi
	@if [ ! -f "api/$*/$*_api.yaml" ]; then \
		echo "Missing OpenAPI spec: api/$*/$*_api.yaml"; \
		exit 1; \
	fi
	go run $(OAPI_CODEGEN) --config "$(OPENAPI_CONFIG_DIR)/$*.yaml" "api/$*/$*_api.yaml"

generate-sqlc:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@v1.30.0 generate

migrate-up:
	DB_PATH=$(DB_PATH) go run ./cmd/migrate

clean-tokens:
	DB_PATH=$(DB_PATH) go run ./cmd/clean-tokens
