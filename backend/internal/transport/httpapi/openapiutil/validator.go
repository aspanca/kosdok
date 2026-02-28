package openapiutil

import (
	"context"
	"fmt"
	"net/http"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/getkin/kin-openapi/openapi3filter"
	"github.com/go-chi/chi/v5"
	"github.com/kosdok/backend/internal/transport/httpapi/respond"
	oapimiddleware "github.com/oapi-codegen/nethttp-middleware"
)

type SwaggerLoader func() (*openapi3.T, error)

func LoadAndMerge(basePath string, loaders ...SwaggerLoader) (*openapi3.T, error) {
	if len(loaders) == 0 {
		return nil, fmt.Errorf("at least one swagger loader is required")
	}

	loaded := make([]*openapi3.T, 0, len(loaders))
	for idx, loader := range loaders {
		spec, err := loader()
		if err != nil {
			return nil, fmt.Errorf("load swagger %d: %w", idx, err)
		}
		if spec == nil {
			return nil, fmt.Errorf("load swagger %d: empty swagger", idx)
		}

		loaded = append(loaded, spec)
	}

	merged := loaded[0]
	for idx := 1; idx < len(loaded); idx++ {
		if err := mergeSwaggerInto(merged, loaded[idx]); err != nil {
			return nil, fmt.Errorf("merge swagger %d: %w", idx, err)
		}
	}

	merged.Servers = openapi3.Servers{{URL: basePath}}

	return merged, nil
}

func InstallRequestValidator(router chi.Router, swagger *openapi3.T) error {
	if swagger == nil {
		return fmt.Errorf("swagger is required")
	}

	router.Use(oapimiddleware.OapiRequestValidatorWithOptions(swagger, &oapimiddleware.Options{
		SilenceServersWarning: true,
		Options: openapi3filter.Options{
			AuthenticationFunc: openapi3filter.NoopAuthenticationFunc,
		},
		ErrorHandlerWithOpts: ValidatorErrorHandler,
	}))

	if err := swagger.Validate(context.Background()); err != nil {
		return fmt.Errorf("validate swagger: %w", err)
	}

	return nil
}

func ValidatorErrorHandler(_ context.Context, _ error, w http.ResponseWriter, _ *http.Request, opts oapimiddleware.ErrorHandlerOpts) {
	switch opts.StatusCode {
	case http.StatusUnauthorized:
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Access token is missing or invalid.")
	default:
		respond.Error(w, http.StatusBadRequest, "invalid_request", "Invalid request parameters.")
	}
}

func StrictRequestErrorHandler(w http.ResponseWriter, _ *http.Request, _ error) {
	respond.Error(w, http.StatusBadRequest, "invalid_request", "Malformed JSON request body.")
}

func StrictResponseErrorHandler(w http.ResponseWriter, _ *http.Request, _ error) {
	respond.Error(w, http.StatusInternalServerError, "internal_error", "Internal server error.")
}

func RouteParamErrorHandler(w http.ResponseWriter, _ *http.Request, _ error) {
	respond.Error(w, http.StatusBadRequest, "invalid_request", "Invalid request parameters.")
}
func mergeSwaggerInto(dst *openapi3.T, src *openapi3.T) error {
	if dst.Paths == nil {
		dst.Paths = openapi3.NewPaths()
	}
	if src.Paths != nil {
		for path, item := range src.Paths.Map() {
			if dst.Paths.Value(path) != nil {
				return fmt.Errorf("duplicate path %q", path)
			}
			dst.Paths.Set(path, item)
		}
	}

	if err := mergeComponents(dst, src); err != nil {
		return err
	}

	if len(dst.Security) == 0 && len(src.Security) > 0 {
		dst.Security = src.Security
	}

	return nil
}

func mergeComponents(dst *openapi3.T, src *openapi3.T) error {
	if src.Components == nil {
		return nil
	}
	if dst.Components == nil {
		components := openapi3.NewComponents()
		dst.Components = &components
	}

	var err error
	dst.Components.Schemas, err = mergeNamedRefs(dst.Components.Schemas, src.Components.Schemas, "schema")
	if err != nil {
		return err
	}
	dst.Components.Parameters, err = mergeNamedRefs(dst.Components.Parameters, src.Components.Parameters, "parameter")
	if err != nil {
		return err
	}
	dst.Components.Headers, err = mergeNamedRefs(dst.Components.Headers, src.Components.Headers, "header")
	if err != nil {
		return err
	}
	dst.Components.RequestBodies, err = mergeNamedRefs(dst.Components.RequestBodies, src.Components.RequestBodies, "request body")
	if err != nil {
		return err
	}
	dst.Components.Responses, err = mergeNamedRefs(dst.Components.Responses, src.Components.Responses, "response")
	if err != nil {
		return err
	}
	dst.Components.SecuritySchemes, err = mergeNamedRefs(dst.Components.SecuritySchemes, src.Components.SecuritySchemes, "security scheme")
	if err != nil {
		return err
	}
	dst.Components.Examples, err = mergeNamedRefs(dst.Components.Examples, src.Components.Examples, "example")
	if err != nil {
		return err
	}
	dst.Components.Links, err = mergeNamedRefs(dst.Components.Links, src.Components.Links, "link")
	if err != nil {
		return err
	}
	dst.Components.Callbacks, err = mergeNamedRefs(dst.Components.Callbacks, src.Components.Callbacks, "callback")
	if err != nil {
		return err
	}

	return nil
}

func mergeNamedRefs[T any](dst map[string]T, src map[string]T, kind string) (map[string]T, error) {
	if dst == nil {
		dst = make(map[string]T, len(src))
	}

	for name, ref := range src {
		if _, exists := dst[name]; exists {
			return nil, fmt.Errorf("duplicate component %s %q", kind, name)
		}
		dst[name] = ref
	}

	return dst, nil
}
