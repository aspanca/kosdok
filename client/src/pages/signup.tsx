import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { TrustBadge } from "../components/trust-badge/trust-badge";

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", formData);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[26px] font-bold tracking-[0.72px] text-[#494e60] mb-2">
              Krijo llogari të re
            </h1>
            <p className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4] mb-4">
              Regjistrohuni për të aksesuar të gjitha shërbimet tona
            </p>
            <TrustBadge variant="compact" className="justify-center" />
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#dedede] shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                    Emri
                  </label>
                  <Input
                    type="text"
                    placeholder="Emri juaj"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="h-12 border-[#dedede] text-[#494e60]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                    Mbiemri
                  </label>
                  <Input
                    type="text"
                    placeholder="Mbiemri juaj"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="h-12 border-[#dedede] text-[#494e60]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@shembull.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-12 border-[#dedede] text-[#494e60]"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Numri i telefonit
                </label>
                <Input
                  type="tel"
                  placeholder="+383 4X XXX XXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-12 border-[#dedede] text-[#494e60]"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Fjalëkalimi
                </label>
                <Input
                  type="password"
                  placeholder="Minimum 8 karaktere"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 border-[#dedede] text-[#494e60]"
                  required
                  minLength={8}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Konfirmo fjalëkalimin
                </label>
                <Input
                  type="password"
                  placeholder="Shkruani përsëri fjalëkalimin"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="h-12 border-[#dedede] text-[#494e60]"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary border-[#dedede] rounded focus:ring-primary"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-[13px] font-normal tracking-[0.39px] text-[#757b8c]"
                >
                  Pajtohem me{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    Kushtet e Përdorimit
                  </Link>{" "}
                  dhe{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    Politikën e Privatësisë
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-[16px] font-[600] tracking-[0.44px] bg-primary hover:bg-primary/90"
              >
                Regjistrohu
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dedede]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#9fa4b4]">ose</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full h-12 flex items-center justify-center gap-3 border border-[#dedede] text-[14px] font-[600] tracking-[0.39px] text-[#494e60] hover:bg-[#f8f8f8] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Vazhdo me Google
              </button>

              <button
                type="button"
                className="w-full h-12 flex items-center justify-center gap-3 border border-[#dedede] text-[14px] font-[600] tracking-[0.39px] text-[#494e60] hover:bg-[#f8f8f8] transition-colors"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Vazhdo me Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="mt-6 text-center text-[14px] font-normal tracking-[0.39px] text-[#757b8c]">
              Keni llogari?{" "}
              <Link to="/signin" className="text-primary font-[600] hover:underline">
                Kyçuni këtu
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-[#6AA8FF] items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto mb-6 opacity-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Mirë se vini në Kosdok
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Platforma më e madhe për gjetjen e mjekëve, klinikave dhe spitaleve në Kosovë. 
            Regjistrohuni për të rezervuar takime dhe menaxhuar shëndetin tuaj.
          </p>
          <div className="mt-8 flex justify-center gap-6 opacity-80">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm">Mjekë</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm">Klinika</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-sm">Pacientë</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
