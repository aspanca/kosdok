package middleware

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

type CSRFCookieConfig struct {
	ProtectedRoutes []RouteAccessRule
	TrustedOrigins  []string
}

func CSRFCookieProtection(cfg CSRFCookieConfig) func(http.Handler) http.Handler {
	trusted := make(map[string]struct{})
	for _, origin := range cfg.TrustedOrigins {
		origin = normalizeOrigin(origin)
		if origin != "" {
			trusted[origin] = struct{}{}
		}
	}

	protected := normalizeAccessRules(cfg.ProtectedRoutes)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !isStateChangingMethod(r.Method) {
				next.ServeHTTP(w, r)
				return
			}

			if _, ok := findAccessRule(r, protected); !ok {
				next.ServeHTTP(w, r)
				return
			}

			origin := normalizeOrigin(r.Header.Get("Origin"))
			refererOrigin := originFromURL(r.Header.Get("Referer"))

			if origin != "" {
				if !isTrustedOrigin(origin, trusted, r.Host) {
					writeCSRFFailure(w)
					return
				}
				next.ServeHTTP(w, r)
				return
			}

			if refererOrigin != "" {
				if !isTrustedOrigin(refererOrigin, trusted, r.Host) {
					writeCSRFFailure(w)
					return
				}
				next.ServeHTTP(w, r)
				return
			}

			// Allow non-browser clients that do not send Origin/Referer.
			next.ServeHTTP(w, r)
		})
	}
}

func isStateChangingMethod(method string) bool {
	method = strings.ToUpper(strings.TrimSpace(method))
	return method == http.MethodPost || method == http.MethodPut || method == http.MethodPatch || method == http.MethodDelete
}

func normalizeOrigin(origin string) string {
	origin = strings.TrimSpace(origin)
	if origin == "" {
		return ""
	}
	u, err := url.Parse(origin)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return ""
	}

	return strings.ToLower(u.Scheme + "://" + u.Host)
}

func originFromURL(rawURL string) string {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" {
		return ""
	}
	u, err := url.Parse(rawURL)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return ""
	}

	return strings.ToLower(u.Scheme + "://" + u.Host)
}

func isTrustedOrigin(origin string, trusted map[string]struct{}, requestHost string) bool {
	if origin == "" {
		return false
	}

	if _, ok := trusted[origin]; ok {
		return true
	}

	requestHost = strings.TrimSpace(strings.ToLower(requestHost))
	if requestHost == "" {
		return false
	}

	originURL, err := url.Parse(origin)
	if err != nil {
		return false
	}

	return strings.EqualFold(originURL.Host, requestHost)
}

func writeCSRFFailure(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusForbidden)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"code":    "csrf_forbidden",
		"message": "Request origin is not trusted.",
	})
}
