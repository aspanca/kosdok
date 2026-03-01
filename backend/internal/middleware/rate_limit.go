package middleware

import (
	"encoding/json"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type RouteRateLimitRule struct {
	Method            string
	Path              string
	RequestsPerMinute int
	Burst             int
}

type rateLimiterStore struct {
	mu       sync.Mutex
	visitors map[string]*visitorRateLimiter
}

type visitorRateLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

func NewRouteRateLimiter(rules []RouteRateLimitRule) func(http.Handler) http.Handler {
	store := &rateLimiterStore{visitors: make(map[string]*visitorRateLimiter)}

	cleanRules := make([]RouteRateLimitRule, 0, len(rules))
	for _, rule := range rules {
		method := strings.ToUpper(strings.TrimSpace(rule.Method))
		path := strings.TrimSpace(rule.Path)
		if method == "" || path == "" || rule.RequestsPerMinute <= 0 {
			continue
		}
		burst := rule.Burst
		if burst <= 0 {
			burst = 1
		}
		cleanRules = append(cleanRules, RouteRateLimitRule{
			Method:            method,
			Path:              path,
			RequestsPerMinute: rule.RequestsPerMinute,
			Burst:             burst,
		})
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			rule, ok := matchRateLimitRule(r, cleanRules)
			if !ok {
				next.ServeHTTP(w, r)
				return
			}

			clientIP := resolveClientIP(r)
			key := rule.Method + "|" + rule.Path + "|" + clientIP

			limiter := store.getOrCreateLimiter(key, rule)
			if !limiter.Allow() {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("Retry-After", "60")
				w.WriteHeader(http.StatusTooManyRequests)
				_ = json.NewEncoder(w).Encode(map[string]string{
					"code":    "rate_limited",
					"message": "Too many requests. Please retry later.",
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (s *rateLimiterStore) getOrCreateLimiter(key string, rule RouteRateLimitRule) *rate.Limiter {
	s.mu.Lock()
	defer s.mu.Unlock()

	now := time.Now().UTC()
	for existingKey, visitor := range s.visitors {
		if now.Sub(visitor.lastSeen) > 15*time.Minute {
			delete(s.visitors, existingKey)
		}
	}

	visitor, ok := s.visitors[key]
	if !ok {
		perSecond := float64(rule.RequestsPerMinute) / 60.0
		visitor = &visitorRateLimiter{
			limiter:  rate.NewLimiter(rate.Limit(perSecond), rule.Burst),
			lastSeen: now,
		}
		s.visitors[key] = visitor
		return visitor.limiter
	}

	visitor.lastSeen = now
	return visitor.limiter
}

func matchRateLimitRule(r *http.Request, rules []RouteRateLimitRule) (RouteRateLimitRule, bool) {
	method := strings.ToUpper(r.Method)
	path := r.URL.Path
	for _, rule := range rules {
		if rule.Method == method && rule.Path == path {
			return rule, true
		}
	}

	return RouteRateLimitRule{}, false
}

func resolveClientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr))
	if err == nil && host != "" {
		return host
	}

	if strings.TrimSpace(r.RemoteAddr) != "" {
		return strings.TrimSpace(r.RemoteAddr)
	}

	return "unknown"
}
