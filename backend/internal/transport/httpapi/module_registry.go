package httpapi

import (
	"database/sql"
	"log/slog"
	"os"

	"github.com/kosdok/backend/internal/platform/config"
	authtransport "github.com/kosdok/backend/internal/transport/httpapi/auth"
)

func registeredV1Modules(cfg config.Config, dbConn *sql.DB) []v1Module {
	auditLogger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	authModule := authtransport.NewHTTPModule(cfg, dbConn, auditLogger)

	return []v1Module{
		{
			name:       authModule.Name,
			routeSpecs: authModule.RouteSpecs,
			swagger:    authModule.Swagger,
			register:   authModule.Register,
		},
	}
}
