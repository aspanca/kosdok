import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/auth-context";
import { useTranslation } from "react-i18next";
import { Building2, Mail, Lock, Phone, MapPin, Check } from "lucide-react";
import { PasswordInput } from "../components/ui/password-input";
import { formInputClass } from "../lib/form-styles";

export const ClinicSignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.clinicName) newErrors.clinicName = "Emri i klinikës është i detyrueshëm";
    if (!formData.email) newErrors.email = "Email-i është i detyrueshëm";
    if (!formData.phone) newErrors.phone = "Telefoni është i detyrueshëm";
    if (!formData.city) newErrors.city = "Qyteti është i detyrueshëm";
    if (!formData.password) newErrors.password = "Fjalëkalimi është i detyrueshëm";
    if (formData.password.length < 8) newErrors.password = "Fjalëkalimi duhet të ketë së paku 8 karaktere";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Fjalëkalimet nuk përputhen";
    if (!formData.agreeTerms) newErrors.agreeTerms = "Duhet të pranoni kushtet";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    // Simulate API call - clinic signup not implemented yet
    await new Promise((resolve) => setTimeout(resolve, 1500));

    login({
      id: Date.now().toString(),
      type: "clinic",
      clinicName: formData.clinicName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
    });

    navigate({ to: "/clinic-dashboard" });
  };

  return (
    <div className="min-h-screen bg-background-page flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">Kosdok për Klinika</span>
          </Link>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Regjistro Klinikën</h1>
          <p className="text-text-muted mb-8">
            Krijo llogari për të menaxhuar klinikën tënde
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Clinic Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                <Building2 className="w-4 h-4 inline mr-1" /> Emri i Klinikës
              </label>
              <Input
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                placeholder="p.sh. Klinika Dentare Smile"
                className={`h-11 ${errors.clinicName ? "border-status-error" : ""}`}
              />
              {errors.clinicName && <p className="text-xs text-status-error mt-1">{errors.clinicName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                <Mail className="w-4 h-4 inline mr-1" /> Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@klinika.com"
                className={`h-11 ${errors.email ? "border-status-error" : ""}`}
              />
              {errors.email && <p className="text-xs text-status-error mt-1">{errors.email}</p>}
            </div>

            {/* Phone & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  <Phone className="w-4 h-4 inline mr-1" /> Telefoni
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+383 4X XXX XXX"
                  className={`h-11 ${errors.phone ? "border-status-error" : ""}`}
                />
                {errors.phone && <p className="text-xs text-status-error mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  <MapPin className="w-4 h-4 inline mr-1" /> Qyteti
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="p.sh. Prishtinë"
                  className={`h-11 ${errors.city ? "border-status-error" : ""}`}
                />
                {errors.city && <p className="text-xs text-status-error mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                <Lock className="w-4 h-4 inline mr-1" /> {t("auth.signin.password")}
              </label>
              <PasswordInput
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t("auth.signin.passwordMinPlaceholder")}
                className={`${formInputClass} ${errors.password ? "border-status-error" : ""}`}
              />
              {errors.password && <p className="text-xs text-status-error mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t("auth.signin.confirmPassword")}
              </label>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder={t("auth.clinicSignup.confirmPasswordPlaceholder")}
                className={`${formInputClass} ${errors.confirmPassword ? "border-status-error" : ""}`}
              />
              {errors.confirmPassword && <p className="text-xs text-status-error mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-sm text-text-secondary">
                Pranoj{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Kushtet e Përdorimit
                </Link>{" "}
                dhe{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Politikën e Privatësisë
                </Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-status-error">{errors.agreeTerms}</p>}

            {/* Submit */}
            <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
              Regjistrohu si Klinikë
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-text-muted mt-6">
            Ke llogari?{" "}
            <Link to="/clinic-signin" className="text-primary font-medium hover:underline">
              Kyçu këtu
            </Link>
          </p>

          {/* Patient Link */}
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-muted mb-3">Je pacient?</p>
            <Link to="/signup" className="text-primary font-medium hover:underline text-sm">
              Regjistrohu si Pacient →
            </Link>
          </div>
        </div>
      </div>

      {/* Right - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-12">
        <div className="max-w-md text-white">
          <Building2 className="w-16 h-16 mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Menaxho Klinikën Tënde</h2>
          <p className="text-lg text-white/80 mb-8">
            Bashkohu me mijëra klinika dhe mjekë në Kosovë. Menaxho terminet, stafin dhe shërbimet nga një vend.
          </p>
          <div className="space-y-4">
            {[
              "Profil i plotë online",
              "Menaxhim i termineve",
              "Stafi dhe shërbimet",
              "Vlerësime nga pacientët",
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
    </div>
  );
};
