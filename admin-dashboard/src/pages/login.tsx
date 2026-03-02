import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAccessToken } from "../lib/axios";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Shield } from "lucide-react";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (getAccessToken()) navigate({ to: "/" });
  }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email ose fjalëkalim i gabuar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-page flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-border p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Paneli i Adminit</h1>
            <p className="text-sm text-text-muted">Kosdok Admin Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-status-error/10 text-status-error text-sm rounded-lg">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kosdok.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Fjalëkalimi</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Duke u kyçur…" : "Kyçu"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-text-muted text-center">
          Kredencialet e paracaktuara: admin@kosdok.com / admin123
        </p>
      </div>
    </div>
  );
};
