package handler

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"
)

type AuthAuditEvent struct {
	Action  string
	Outcome string
	Reason  string
	Email   string
	UserID  string
}

func newDefaultAuditLogger() *slog.Logger {
	return slog.New(slog.NewJSONHandler(os.Stdout, nil))
}

func logAuthEvent(ctx context.Context, logger *slog.Logger, r *http.Request, event AuthAuditEvent) {
	if logger == nil {
		logger = newDefaultAuditLogger()
	}

	action := strings.TrimSpace(event.Action)
	if action == "" {
		action = "unknown"
	}

	outcome := strings.TrimSpace(event.Outcome)
	if outcome == "" {
		outcome = "unknown"
	}

	attrs := []any{
		"category", "auth",
		"action", action,
		"outcome", outcome,
		"path", r.URL.Path,
		"method", r.Method,
		"remote_ip", r.RemoteAddr,
		"user_agent", r.UserAgent(),
		"timestamp", time.Now().UTC().Format(time.RFC3339),
	}

	if strings.TrimSpace(event.Reason) != "" {
		attrs = append(attrs, "reason", event.Reason)
	}
	if strings.TrimSpace(event.Email) != "" {
		attrs = append(attrs, "email", strings.TrimSpace(strings.ToLower(event.Email)))
	}
	if strings.TrimSpace(event.UserID) != "" {
		attrs = append(attrs, "user_id", strings.TrimSpace(event.UserID))
	}

	logger.InfoContext(ctx, "auth_event", attrs...)
}
