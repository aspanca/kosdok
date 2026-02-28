package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"regexp"
	"strings"
)

type PermissionMatchMode string

const (
	PermissionMatchAll PermissionMatchMode = "all"
	PermissionMatchAny PermissionMatchMode = "any"
)

type RouteAccessRule struct {
	Method              string
	Path                string
	PathRegex           string
	RequireAuth         bool
	RequiredPermissions []string
	PermissionMode      PermissionMatchMode
}

type normalizedRouteAccessRule struct {
	method              string
	path                string
	pathMatcher         *regexp.Regexp
	requireAuth         bool
	requiredPermissions []string
	permissionMode      PermissionMatchMode
}

func RequireAuth() func(http.Handler) http.Handler {
	return requireAuthorization(nil, PermissionMatchAll)
}

func RequirePermission(permission string) func(http.Handler) http.Handler {
	permission = strings.TrimSpace(permission)
	if permission == "" {
		return RequireAuth()
	}

	return requireAuthorization([]string{permission}, PermissionMatchAll)
}

func RequireAnyPermission(permissions ...string) func(http.Handler) http.Handler {
	cleaned := cleanPermissions(permissions)
	if len(cleaned) == 0 {
		return RequireAuth()
	}

	return requireAuthorization(cleaned, PermissionMatchAny)
}

func EnforceRouteAccess(rules []RouteAccessRule) func(http.Handler) http.Handler {
	normalized := normalizeAccessRules(rules)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			rule, ok := findAccessRule(r, normalized)
			if !ok {
				next.ServeHTTP(w, r)
				return
			}

			if !rule.requireAuth && len(rule.requiredPermissions) == 0 {
				next.ServeHTTP(w, r)
				return
			}

			authorized, status, code, message := authorizeRequest(r, rule.requiredPermissions, rule.permissionMode)
			if !authorized {
				writeRouteAccessError(w, status, code, message)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func normalizeAccessRules(rules []RouteAccessRule) []normalizedRouteAccessRule {
	normalized := make([]normalizedRouteAccessRule, 0, len(rules))
	for _, rule := range rules {
		method := strings.ToUpper(strings.TrimSpace(rule.Method))
		path := strings.TrimSpace(rule.Path)
		pathRegex := strings.TrimSpace(rule.PathRegex)
		if method == "" || (path == "" && pathRegex == "") {
			continue
		}

		permissions := cleanPermissions(rule.RequiredPermissions)

		matcher, err := compilePathMatcher(path, pathRegex)
		if err != nil {
			continue
		}

		mode := rule.PermissionMode
		if mode != PermissionMatchAny {
			mode = PermissionMatchAll
		}

		normalized = append(normalized, normalizedRouteAccessRule{
			method:              method,
			path:                path,
			pathMatcher:         matcher,
			requireAuth:         rule.RequireAuth,
			requiredPermissions: permissions,
			permissionMode:      mode,
		})
	}

	return normalized
}

func findAccessRule(r *http.Request, rules []normalizedRouteAccessRule) (normalizedRouteAccessRule, bool) {
	method := strings.ToUpper(r.Method)
	path := r.URL.Path
	for _, rule := range rules {
		if rule.method != method {
			continue
		}

		if rule.pathMatcher != nil {
			if rule.pathMatcher.MatchString(path) {
				return rule, true
			}
			continue
		}

		if rule.path == path {
			return rule, true
		}
	}

	return normalizedRouteAccessRule{}, false
}

func hasRequiredPermissions(granted []string, required []string, mode PermissionMatchMode) bool {
	if len(required) == 0 {
		return true
	}

	grantedSet := make(map[string]struct{}, len(granted))
	for _, permission := range granted {
		grantedSet[permission] = struct{}{}
	}

	if mode == PermissionMatchAny {
		for _, permission := range required {
			if _, ok := grantedSet[permission]; ok {
				return true
			}
		}
		return false
	}

	for _, permission := range required {
		if _, ok := grantedSet[permission]; !ok {
			return false
		}
	}

	return true
}

func authorizeRequest(r *http.Request, requiredPermissions []string, mode PermissionMatchMode) (bool, int, string, string) {
	authErr := AuthErrorFromContext(r.Context())
	if authErr != nil {
		return false, http.StatusUnauthorized, "unauthorized", "Access token is missing or invalid."
	}

	claims, ok := ClaimsFromContext(r.Context())
	if !ok {
		return false, http.StatusUnauthorized, "unauthorized", "Access token is missing or invalid."
	}

	if len(requiredPermissions) > 0 && !hasRequiredPermissions(claims.Permissions, requiredPermissions, mode) {
		return false, http.StatusForbidden, "forbidden", "You do not have the required permission."
	}

	return true, 0, "", ""
}

func requireAuthorization(requiredPermissions []string, mode PermissionMatchMode) func(http.Handler) http.Handler {
	requiredPermissions = cleanPermissions(requiredPermissions)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorized, status, code, message := authorizeRequest(r, requiredPermissions, mode)
			if !authorized {
				writeRouteAccessError(w, status, code, message)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func cleanPermissions(permissions []string) []string {
	cleaned := make([]string, 0, len(permissions))
	for _, permission := range permissions {
		permission = strings.TrimSpace(permission)
		if permission != "" {
			cleaned = append(cleaned, permission)
		}
	}

	return cleaned
}

func compilePathMatcher(path string, pathRegex string) (*regexp.Regexp, error) {
	if pathRegex != "" {
		matcher, err := regexp.Compile(pathRegex)
		if err != nil {
			return nil, fmt.Errorf("compile path regex %q: %w", pathRegex, err)
		}
		return matcher, nil
	}

	if path == "" {
		return nil, nil
	}

	if !strings.Contains(path, "{") && !strings.Contains(path, "*") {
		return nil, nil
	}

	regexPattern := pathTemplateToRegex(path)
	matcher, err := regexp.Compile(regexPattern)
	if err != nil {
		return nil, fmt.Errorf("compile path template %q: %w", path, err)
	}

	return matcher, nil
}

func pathTemplateToRegex(path string) string {
	if path == "/" {
		return `^/$`
	}

	trimmed := strings.Trim(path, "/")
	parts := strings.Split(trimmed, "/")
	regexParts := make([]string, 0, len(parts))
	for _, part := range parts {
		switch {
		case part == "**":
			regexParts = append(regexParts, `.+`)
		case part == "*":
			regexParts = append(regexParts, `[^/]+`)
		case strings.HasPrefix(part, "{") && strings.HasSuffix(part, "}"):
			regexParts = append(regexParts, `[^/]+`)
		default:
			regexParts = append(regexParts, regexp.QuoteMeta(part))
		}
	}

	return `^/` + strings.Join(regexParts, `/`) + `$`
}

func writeRouteAccessError(w http.ResponseWriter, status int, code string, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"code":    code,
		"message": message,
	})
}
