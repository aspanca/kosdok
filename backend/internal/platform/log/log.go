package log

import (
	stdlog "log"
	"os"
)

func New() *stdlog.Logger {
	return stdlog.New(os.Stdout, "", stdlog.LstdFlags|stdlog.LUTC)
}
