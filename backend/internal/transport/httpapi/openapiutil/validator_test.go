package openapiutil

import (
	"context"
	"testing"

	authapi "github.com/kosdok/backend/internal/transport/httpapi/auth/openapi"
)

func TestLoadAndMergeWithAuthSwaggerProducesValidSpec(t *testing.T) {
	swagger, err := LoadAndMerge("/v1", authapi.GetSwagger)
	if err != nil {
		t.Fatalf("LoadAndMerge() error = %v", err)
	}

	if swagger.Components == nil || len(swagger.Components.Schemas) == 0 {
		t.Fatalf("expected non-empty schemas in merged swagger")
	}

	if swagger.Paths == nil || swagger.Paths.Value("/auth/login") == nil {
		t.Fatalf("expected /auth/login path in merged swagger")
	}

	if err := swagger.Validate(context.Background()); err != nil {
		t.Fatalf("Validate() error = %v", err)
	}
}
