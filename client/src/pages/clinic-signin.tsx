import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { useAuth } from "../context/auth-context";
import { Building2, Mail, Lock, AlertCircle, Check } from "lucide-react";
import { formInputClass } from "../lib/form-styles";

// Demo clinic credentials
const DEMO_CLINIC = {
  email: "klinika@kosdok.com",
  password: "klinika123",
  data: {
    id: "clinic-1",
    type: "clinic" as const,
    clinicName: "Spitali Amerikan",
    email: "klinika@kosdok.com",
    phone: "+383 49 123 456",
    city: "Prishtinë",
    logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop",
  },
};

export const ClinicSigninPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError(t("auth.clinicSignin.errorFillFields"));
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check demo credentials
    if (formData.email === DEMO_CLINIC.email && formData.password === DEMO_CLINIC.password) {
      login(DEMO_CLINIC.data);
      navigate({ to: "/clinic-profile" });
    } else {
      setError(t("auth.clinicSignin.errorWrongCredentials"));
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: DEMO_CLINIC.email,
      password: DEMO_CLINIC.password,
    });
  };

  return (
    <div className="min-h-screen bg-background-page flex">
      {/* Left - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-12">
        <div className="max-w-md text-white">
          <Building2 className="w-16 h-16 mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Paneli i Klinikës</h2>
          <p className="text-lg text-white/80 mb-8">
            Kyçu për të menaxhuar profilin, terminet dhe stafin e klinikës tënde.
          </p>
          <div className="space-y-4">
            {[
              "Shiko terminet e rezervuara",
              "Menaxho stafin mjekësor",
              "Përditëso orarin e punës",
              "Shiko vlerësimet e pacientëve",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">Kosdok për Klinika</span>
          </Link>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Kyçu si Klinikë</h1>
          <p className="text-text-muted mb-8">
            Mirë se vjen përsëri! Kyçu për të vazhduar.
          </p>

          {/* Demo Credentials Info */}
          <div className="bg-primary-lightest border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary font-medium mb-2">🏥 Kredencialet demo për klinikë:</p>
            <p className="text-xs text-text-secondary">Email: <code className="bg-white px-1 rounded">{DEMO_CLINIC.email}</code></p>
            <p className="text-xs text-text-secondary">Password: <code className="bg-white px-1 rounded">{DEMO_CLINIC.password}</code></p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="mt-2 text-xs text-primary font-medium hover:underline"
            >
              Plotëso automatikisht →
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-status-error/10 border border-status-error/20 rounded-lg p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-status-error" />
              <span className="text-sm text-status-error">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                <Mail className="w-4 h-4 inline mr-1" /> Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t("auth.clinicSignin.emailPlaceholder")}
                className={formInputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                <Lock className="w-4 h-4 inline mr-1" /> {t("auth.signin.password")}
              </label>
              <PasswordInput
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t("auth.clinicSignin.passwordPlaceholder")}
                className={formInputClass}
              />
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">Më mbaj mend</span>
              </label>
              <Link to="/signin" search={{ mode: "login" }} className="text-sm text-primary hover:underline">
                Harrove fjalëkalimin?
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
              Kyçu
            </Button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Nuk ke llogari?{" "}
            <Link to="/clinic-signup" className="text-primary font-medium hover:underline">
              Regjistrohu si Klinikë
            </Link>
          </p>

          {/* Patient Link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-muted mb-3">Je pacient?</p>
            <Link to="/signin" search={{ mode: "login" }} className="text-primary font-medium hover:underline text-sm">
              Kyçu si Pacient →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
