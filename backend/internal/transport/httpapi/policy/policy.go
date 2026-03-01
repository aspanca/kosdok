package policy

import "github.com/kosdok/backend/internal/middleware"

type RateLimitPolicy struct {
	RequestsPerMinute int
	Burst             int
}

type RouteSpec struct {
	Method                  string
	Path                    string
	RequireAuth             bool
	RequiredPermissions     []string
	PermissionMode          middleware.PermissionMatchMode
	RateLimit               *RateLimitPolicy
	RequireCSRFCookieOrigin bool
}

type Bundle struct {
	AccessRules         []middleware.RouteAccessRule
	RateLimitRules      []middleware.RouteRateLimitRule
	CSRFProtectedRoutes []middleware.RouteAccessRule
}

func Build(specs []RouteSpec) Bundle {
	bundle := Bundle{
		AccessRules:         make([]middleware.RouteAccessRule, 0, len(specs)),
		RateLimitRules:      make([]middleware.RouteRateLimitRule, 0, len(specs)),
		CSRFProtectedRoutes: make([]middleware.RouteAccessRule, 0, len(specs)),
	}

	for _, spec := range specs {
		if spec.RequireAuth || len(spec.RequiredPermissions) > 0 {
			bundle.AccessRules = append(bundle.AccessRules, middleware.RouteAccessRule{
				Method:              spec.Method,
				Path:                spec.Path,
				RequireAuth:         spec.RequireAuth,
				RequiredPermissions: append([]string(nil), spec.RequiredPermissions...),
				PermissionMode:      spec.PermissionMode,
			})
		}

		if spec.RateLimit != nil {
			bundle.RateLimitRules = append(bundle.RateLimitRules, middleware.RouteRateLimitRule{
				Method:            spec.Method,
				Path:              spec.Path,
				RequestsPerMinute: spec.RateLimit.RequestsPerMinute,
				Burst:             spec.RateLimit.Burst,
			})
		}

		if spec.RequireCSRFCookieOrigin {
			bundle.CSRFProtectedRoutes = append(bundle.CSRFProtectedRoutes, middleware.RouteAccessRule{
				Method: spec.Method,
				Path:   spec.Path,
			})
		}
	}

	return bundle
}

func Merge(bundles ...Bundle) Bundle {
	out := Bundle{}
	for _, bundle := range bundles {
		out.AccessRules = append(out.AccessRules, bundle.AccessRules...)
		out.RateLimitRules = append(out.RateLimitRules, bundle.RateLimitRules...)
		out.CSRFProtectedRoutes = append(out.CSRFProtectedRoutes, bundle.CSRFProtectedRoutes...)
	}

	return out
}
