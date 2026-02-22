import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/auth-context";

// Mock user credentials
const MOCK_CREDENTIALS = {
  email: "astritspanca22@gmail.com",
  password: "changepassword123AB@",
  user: {
    id: "1",
    type: "patient" as const,
    firstName: "Astrit",
    lastName: "Spanca",
    email: "astritspanca22@gmail.com",
  },
};

export const SigninPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Check credentials
      if (
        formData.email === MOCK_CREDENTIALS.email &&
        formData.password === MOCK_CREDENTIALS.password
      ) {
        login(MOCK_CREDENTIALS.user);
        navigate({ to: "/" });
      } else {
        setError("Email ose fjalëkalimi janë gabim. Provoni përsëri.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      {/* Left - Image/Branding (Hidden on mobile) */}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Mirë se u kthyet!
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Kyçuni në llogarinë tuaj për të aksesuar historinë e takimeve, 
            mjekët e preferuar dhe të gjitha shërbimet e Kosdok.
          </p>
          <div className="mt-8 space-y-4 text-left">
            <div className="flex items-center gap-3 opacity-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Rezervoni takime online 24/7</span>
            </div>
            <div className="flex items-center gap-3 opacity-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Historiku i plotë i vizitave</span>
            </div>
            <div className="flex items-center gap-3 opacity-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Përkujtues automatik për takime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[26px] font-bold tracking-[0.72px] text-[#494e60] mb-2">
              Kyçuni në llogari
            </h1>
            <p className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4]">
              Shkruani kredencialet tuaja për të vazhduar
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#dedede] shadow-sm p-6 sm:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 text-[14px] flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mb-5 p-4 bg-blue-50 border border-blue-200 text-[13px] text-[#494e60]">
              <p className="font-semibold text-primary mb-2">Demo kredencialet:</p>
              <p><span className="text-[#9fa4b4]">Email:</span> astritspanca22@gmail.com</p>
              <p><span className="text-[#9fa4b4]">Password:</span> changepassword123AB@</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@shembull.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setError("");
                  }}
                  className={`h-12 border-[#dedede] text-[#494e60] ${error ? "border-red-300" : ""}`}
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
                  placeholder="Shkruani fjalëkalimin"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setError("");
                  }}
                  className={`h-12 border-[#dedede] text-[#494e60] ${error ? "border-red-300" : ""}`}
                  required
                />
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-[#dedede] rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[13px] font-normal tracking-[0.39px] text-[#757b8c]"
                  >
                    Më mbaj mend
                  </label>
                </div>
                <Link
                  to="/signin"
                  className="text-[13px] font-[600] tracking-[0.39px] text-primary hover:underline"
                >
                  Keni harruar fjalëkalimin?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-[16px] font-[600] tracking-[0.44px] bg-primary hover:bg-primary/90 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Duke u kyçur...
                  </div>
                ) : (
                  "Kyçu"
                )}
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

            {/* Register Link */}
            <p className="mt-6 text-center text-[14px] font-normal tracking-[0.39px] text-[#757b8c]">
              Nuk keni llogari?{" "}
              <Link to="/signup" className="text-primary font-[600] hover:underline">
                Regjistrohuni falas
              </Link>
            </p>

            {/* Clinic Link */}
            <div className="mt-6 pt-6 border-t border-[#dedede] text-center">
              <p className="text-[13px] text-[#9fa4b4] mb-2">Jeni klinikë ose spital?</p>
              <Link to="/clinic-signin" className="text-primary font-[600] text-[14px] hover:underline">
                Kyçu si Klinikë →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
