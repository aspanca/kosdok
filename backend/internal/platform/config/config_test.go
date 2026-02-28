package config

import "testing"

func TestAddress(t *testing.T) {
	cfg := Config{Port: "9999"}
	if got := cfg.Address(); got != ":9999" {
		t.Fatalf("Address() = %s, want %s", got, ":9999")
	}
}
