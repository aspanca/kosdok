import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../context/auth-context";
import { useCities } from "../lib/hooks/use-cities";
import { formInputClass } from "../lib/form-styles";

type AuthMode = "login" | "signup";

type AccountType = "patient" | "doctor" | "clinic" | "pharmacy" | "lab";

type SigninPageProps = {
  initialMode?: AuthMode;
};

const ACCOUNT_TYPES: { id: AccountType; icon: string; labelKey: string; descKey: string }[] = [
  { id: "patient", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", labelKey: "auth.accountType.patient", descKey: "auth.accountType.patientDesc" },
  { id: "doctor", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", labelKey: "auth.accountType.doctor", descKey: "auth.accountType.doctorDesc" },
  { id: "clinic", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", labelKey: "auth.accountType.clinic", descKey: "auth.accountType.clinicDesc" },
  { id: "pharmacy", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", labelKey: "auth.accountType.pharmacy", descKey: "auth.accountType.pharmacyDesc" },
  { id: "lab", icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", labelKey: "auth.accountType.lab", descKey: "auth.accountType.labDesc" },
];

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type SignupFormValues = {
  firstName: string;
  lastName: string;
  clinicName: string;
  email: string;
  phone: string;
  city: string;
  gender: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
};

export const SigninPage = ({ initialMode: propMode }: SigninPageProps = {}) => {
  const { t } = useTranslation();
  const { signIn, registerPatient, registerClinic } = useAuth();
  const { data: cities = [] } = useCities();
  const navigate = useNavigate();
  const urlMode = (() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    return m === "signup" || m === "login" ? m : null;
  })();
  const [mode, setMode] = useState<AuthMode>(propMode ?? urlMode ?? "login");
  const [accountType, setAccountType] = useState<AccountType>("patient");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const next = propMode ?? urlMode;
    if (next) setMode(next);
  }, [propMode, urlMode]);

  const loginForm = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const signupForm = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      clinicName: "",
      email: "",
      phone: "",
      city: "__none__",
      gender: "__none__",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onLoginSubmit = loginForm.handleSubmit(async (data) => {
    setError("");
    try {
      const user = await signIn(data.email, data.password);
      navigate({ to: user.type === "clinic" ? "/clinic-dashboard" : "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.signin.errorWrongCredentials"));
    }
  });

  const onSignupSubmit = signupForm.handleSubmit(async (data) => {
    setError("");
    setSuccessMessage("");
    if (!data.agreeTerms) {
      setError(t("auth.signin.errorTerms"));
      return;
    }
    const city = data.city === "__none__" ? undefined : data.city;
    try {
      if (accountType === "patient") {
        const result = await registerPatient({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || undefined,
          city,
          gender: data.gender === "__none__" ? undefined : (data.gender as "male" | "female"),
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
        if (result?.message) {
          setSuccessMessage(result.message);
        } else {
          navigate({ to: "/" });
        }
      } else {
        if (!data.clinicName?.trim() || !data.phone || !city || city === "__none__") {
          setError(t("auth.signin.errorGeneric"));
          return;
        }
        await registerClinic({
          clinicName: data.clinicName.trim(),
          email: data.email,
          phone: data.phone,
          city,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
        navigate({ to: "/clinic-dashboard" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.signin.errorGeneric"));
    }
  });

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      {/* Left - Image/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-[#6AA8FF] items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto mb-6 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">{t("auth.signin.welcome")}</h2>
          <p className="text-lg opacity-90 leading-relaxed">{t("auth.signin.description")}</p>
          <div className="mt-8 space-y-4 text-left">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 opacity-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t(`auth.signin.feature${i}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Account Type Selector */}
          <div className="mb-8">
            <h2 className="text-[15px] font-[600] text-[#494e60] mb-3">{t("auth.accountType.title")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAccountType(type.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                    accountType === type.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#f9fafb]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accountType === type.id ? "bg-primary/15" : "bg-[#f3f4f6]"}`}>
                    <svg className={`w-5 h-5 ${accountType === type.id ? "text-primary" : "text-[#6b7280]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                    </svg>
                  </div>
                  <span className={`text-[13px] font-[600] ${accountType === type.id ? "text-primary" : "text-[#494e60]"}`}>
                    {t(type.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shared login/signup form for all account types */}
          <div className="text-center mb-6">
                <h1 className="text-[26px] font-bold tracking-[0.72px] text-[#494e60] mb-2">
                  {mode === "login"
                    ? t("auth.signin.loginTitle")
                    : `${t("auth.accountType.registerAs")} ${t(ACCOUNT_TYPES.find((type) => type.id === accountType)!.labelKey)}`}
                </h1>
                <p className="text-[14px] font-normal tracking-[0.39px] text-[#9fa4b4]">
                  {mode === "login" ? t("auth.signin.loginSubtitle") : t("auth.signin.signupSubtitle")}
                </p>
              </div>

              <div className="flex mb-6 bg-[#eef1f5] rounded-lg p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-[14px] font-[600] rounded-md transition-colors ${mode === "login" ? "bg-white text-[#494e60] shadow-sm" : "text-[#9fa4b4] hover:text-[#494e60]"}`}
            >
              {t("auth.signin.tabLogin")}
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 py-2.5 text-[14px] font-[600] rounded-md transition-colors ${mode === "signup" ? "bg-white text-[#494e60] shadow-sm" : "text-[#9fa4b4] hover:text-[#494e60]"}`}
            >
              {t("auth.signin.tabSignup")}
            </button>
          </div>

          <div className="bg-white border border-[#dedede] shadow-sm p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 text-[14px] flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 text-[14px] flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {successMessage}
              </div>
            )}

            {mode === "login" ? (
              <form onSubmit={onLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.email")}</label>
                  <Input
                    {...loginForm.register("email", { required: true })}
                    type="email"
                    placeholder={t("auth.signin.emailPlaceholder")}
                    className={`${formInputClass} ${loginForm.formState.errors.email ? "border-red-300" : ""}`}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.password")}</label>
                  <Controller
                    name="password"
                    control={loginForm.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder={t("auth.signin.passwordPlaceholder")}
                        className={`${formInputClass} ${loginForm.formState.errors.password ? "border-red-300" : ""}`}
                      />
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...loginForm.register("rememberMe")} className="w-4 h-4 text-primary border-[#dedede] rounded focus:ring-primary" />
                    <span className="text-[13px] font-normal tracking-[0.39px] text-[#757b8c]">{t("auth.signin.rememberMe")}</span>
                  </label>
                  <Link to="/signin" search={{ mode: "login" }} className="text-[13px] font-[600] tracking-[0.39px] text-primary hover:underline">
                    {t("auth.signin.forgotPassword")}
                  </Link>
                </div>
                <Button type="submit" disabled={loginForm.formState.isSubmitting} className="w-full h-12 text-[16px] font-[600] tracking-[0.44px] bg-primary hover:bg-primary/90 disabled:opacity-70">
                  {loginForm.formState.isSubmitting ? t("auth.signin.loadingLogin") : t("auth.signin.submitLogin")}
                </Button>
              </form>
            ) : (
              <form onSubmit={onSignupSubmit} className="space-y-5">
                {accountType === "patient" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.firstName")}</label>
                      <Input {...signupForm.register("firstName", { required: accountType === "patient" })} placeholder={t("auth.signin.firstNamePlaceholder")} className={formInputClass} />
                    </div>
                    <div>
                      <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.lastName")}</label>
                      <Input {...signupForm.register("lastName", { required: accountType === "patient" })} placeholder={t("auth.signin.lastNamePlaceholder")} className={formInputClass} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.clinicName")}</label>
                    <Input {...signupForm.register("clinicName", { required: accountType !== "patient" })} placeholder={t("auth.signin.clinicNamePlaceholder")} className={formInputClass} />
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.email")}</label>
                  <Input {...signupForm.register("email", { required: true })} type="email" placeholder={t("auth.signin.emailPlaceholder")} className={formInputClass} />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.phone")}</label>
                  <Input {...signupForm.register("phone", { required: true })} type="tel" placeholder={t("auth.signin.phonePlaceholder")} className={formInputClass} />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.city")}</label>
                  <Controller
                    name="city"
                    control={signupForm.control}
                    render={({ field }) => (
                      <Select value={field.value || "__none__"} onValueChange={field.onChange}>
                        <SelectTrigger className={formInputClass}>
                          <SelectValue placeholder={t("auth.signin.cityPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">{t("auth.signin.cityPlaceholder")}</SelectItem>
                          {cities.map((c) => (
                            <SelectItem key={c.id} value={c.name}>{c.name} ({c.postcode})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {accountType === "patient" && (
                  <div>
                    <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.gender")}</label>
                    <Controller
                      name="gender"
                      control={signupForm.control}
                      render={({ field }) => (
                        <Select value={field.value || "__none__"} onValueChange={field.onChange}>
                          <SelectTrigger className={formInputClass}>
                            <SelectValue placeholder={t("auth.signin.genderPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none__">{t("auth.signin.genderPlaceholder")}</SelectItem>
                            <SelectItem value="male">{t("auth.signin.genderMale")}</SelectItem>
                            <SelectItem value="female">{t("auth.signin.genderFemale")}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.password")}</label>
                  <Controller
                    name="password"
                    control={signupForm.control}
                    rules={{ required: true, minLength: 8 }}
                    render={({ field }) => (
                      <PasswordInput {...field} placeholder={t("auth.signin.passwordMinPlaceholder")} className={formInputClass} />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-[600] tracking-[0.39px] text-[#494e60] mb-2">{t("auth.signin.confirmPassword")}</label>
                  <Controller
                    name="confirmPassword"
                    control={signupForm.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <PasswordInput {...field} placeholder={t("auth.signin.confirmPasswordPlaceholder")} className={formInputClass} />
                    )}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" {...signupForm.register("agreeTerms", { required: true })} className="mt-1 w-4 h-4 text-primary border-[#dedede] rounded focus:ring-primary" />
                  <label className="text-[13px] font-normal tracking-[0.39px] text-[#757b8c]">
                    {t("auth.signin.termsAgree")}{" "}
                    <Link to="/privacy-policy" className="text-primary hover:underline">{t("auth.signin.terms")}</Link>{" "}
                    {t("auth.signin.and")}{" "}
                    <Link to="/privacy-policy" className="text-primary hover:underline">{t("auth.signin.privacyPolicy")}</Link>
                  </label>
                </div>
                <Button type="submit" disabled={signupForm.formState.isSubmitting} className="w-full h-12 text-[16px] font-[600] tracking-[0.44px] bg-primary hover:bg-primary/90 disabled:opacity-70">
                  {signupForm.formState.isSubmitting ? t("auth.signin.loadingSignup") : t("auth.signin.submitSignup")}
                </Button>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#dedede]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#9fa4b4]">{t("auth.signin.or")}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button type="button" className="w-full h-12 flex items-center justify-center gap-3 border border-[#dedede] text-[14px] font-[600] tracking-[0.39px] text-[#494e60] hover:bg-[#f8f8f8] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {t("auth.signin.continueGoogle")}
              </button>
              <button type="button" className="w-full h-12 flex items-center justify-center gap-3 border border-[#dedede] text-[14px] font-[600] tracking-[0.39px] text-[#494e60] hover:bg-[#f8f8f8] transition-colors">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {t("auth.signin.continueFacebook")}
              </button>
            </div>

            <p className="mt-6 text-center text-[14px] font-normal tracking-[0.39px] text-[#757b8c]">
              {mode === "login" ? (
                <>
                  {t("auth.signin.noAccount")}{" "}
                  <button type="button" onClick={() => switchMode("signup")} className="text-primary font-[600] hover:underline">
                    {t("auth.signin.registerFree")}
                  </button>
                </>
              ) : (
                <>
                  {t("auth.signin.hasAccount")}{" "}
                  <button type="button" onClick={() => switchMode("login")} className="text-primary font-[600] hover:underline">
                    {t("auth.signin.loginHere")}
                  </button>
                </>
              )}
            </p>

            {accountType === "patient" && (
              <div className="mt-6 pt-6 border-t border-[#dedede] text-center">
                <p className="text-[13px] text-[#9fa4b4] mb-2">{t("auth.signin.clinicPrompt")}</p>
                <Link to="/clinic-signin" className="text-primary font-[600] text-[14px] hover:underline">
                  {t("auth.signin.loginAsClinic")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
