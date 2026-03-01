import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useAuth, isPatientUser, isClinicUser, getUserDisplayName, getUserInitials, getUserPicture } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { DatePicker } from "../components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useCities } from "../lib/hooks/use-cities";
import { formatDate, formatDateForInput } from "../lib/i18n/date";
import { formInputClass } from "../lib/form-styles";

const GENDER_TO_API: Record<string, "male" | "female"> = {
  Mashkull: "male",
  Femër: "female",
};
const GENDER_FROM_API: Record<string, string> = {
  male: "Mashkull",
  female: "Femër",
};

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function getDefaultValues(user: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string; dateOfBirth?: string; gender?: string; address?: string; city?: string } | null): ProfileFormValues {
  if (!user) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "Mashkull",
      address: "",
      city: "",
    };
  }
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email ?? "",
    phone: user.phoneNumber ?? "",
    dateOfBirth: formatDateForInput(user.dateOfBirth) || "",
    gender: user.gender ? GENDER_FROM_API[user.gender] ?? "Mashkull" : "Mashkull",
    address: user.address ?? "",
    city: user.city ?? "",
  };
}

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, isLoggedIn, logout, updateProfile, uploadProfilePicture, changePassword } = useAuth();
  const { data: cities = [] } = useCities();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [pendingPictureFile, setPendingPictureFile] = useState<File | null>(null);
  const [removePicture, setRemovePicture] = useState(false);
  const [pictureError, setPictureError] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: getDefaultValues(null),
  });
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Sync form with user data when user loads
  useEffect(() => {
    if (isPatientUser(user)) {
      profileForm.reset(getDefaultValues(user));
    }
  }, [user]);

  const blobPreviewUrl = useMemo(() => {
    if (pendingPictureFile) return URL.createObjectURL(pendingPictureFile);
    return null;
  }, [pendingPictureFile]);

  useEffect(() => {
    return () => {
      if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl);
    };
  }, [blobPreviewUrl]);

  useEffect(() => {
    if (!isEditing) {
      setPendingPictureFile(null);
      setRemovePicture(false);
      setPictureError(null);
    }
  }, [isEditing]);

  const displayPicture = removePicture ? null : (blobPreviewUrl ?? (user ? getUserPicture(user) ?? null : null));

  const onProfileSubmit = profileForm.handleSubmit(async (data) => {
    setSaveError(null);
    setPictureError(null);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: GENDER_TO_API[data.gender],
        address: data.address || undefined,
        city: data.city || undefined,
      };
      if (removePicture) {
        await updateProfile({ ...payload, picture: "" });
      } else if (pendingPictureFile) {
        await uploadProfilePicture(pendingPictureFile);
        await updateProfile(payload);
      } else {
        await updateProfile(payload);
      }
      setIsEditing(false);
      setPendingPictureFile(null);
      setRemovePicture(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t("auth.signin.errorGeneric"));
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (data) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError(t("profile.passwordErrorMismatch"));
      return;
    }
    if (data.newPassword.length < 8) {
      setPasswordError(t("profile.passwordErrorLength"));
      return;
    }
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setPasswordSuccess(t("profile.passwordSuccess"));
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : t("auth.signin.errorGeneric"));
    }
  });

  const handlePictureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setPictureError(t("profile.pictureErrorFormat"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPictureError(t("profile.pictureErrorSize"));
      return;
    }
    setPictureError(null);
    setRemovePicture(false);
    setPendingPictureFile(file);
    e.target.value = "";
  };

  const handleRemovePicture = () => {
    setPendingPictureFile(null);
    setRemovePicture(true);
    setPictureError(null);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  if (isClinicUser(user)) {
    navigate({ to: "/clinic-profile" });
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#dedede] p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-[#9fa4b4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-[22px] font-[600] text-[#494e60] mb-2">{t("profile.loginRequired")}</h1>
          <p className="text-[14px] text-[#9fa4b4] mb-6">{t("profile.loginRequiredMessage")}</p>
          <Link to="/signin" search={{ mode: "login" }} className="inline-flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-white text-[14px] font-[600]">
            {t("appBar.login")}
          </Link>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { to: "/profile", label: t("profile.sidebar.profile"), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", active: true },
    { to: "/appointments", label: t("profile.sidebar.appointments"), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", active: false },
    { to: "/my-reviews", label: t("profile.sidebar.reviews"), icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-[26px] font-[600] tracking-[0.72px] text-[#494e60]">{t("profile.title")}</h1>
          <p className="text-[14px] text-[#9fa4b4] mt-1">{t("profile.subtitle")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[#dedede] overflow-hidden">
              <div className="p-5 border-b border-[#dedede]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-[18px] font-bold shrink-0">
                    {displayPicture ? (
                      <img src={displayPicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user ? getUserInitials(user) : ""
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-[600] text-[#494e60]">{user ? getUserDisplayName(user) : ""}</h3>
                    <p className="text-[13px] text-[#9fa4b4]">{user?.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 text-[14px] font-[500] transition-colors ${
                      link.active ? "bg-primary/5 text-primary" : "text-[#494e60] hover:bg-[#f8f8f8]"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-[500] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t("profile.logout")}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Form */}
            <div className="bg-white border border-[#dedede]">
              <div className="px-6 py-5 border-b border-[#dedede] flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-[600] text-[#494e60]">{t("profile.personalInfo")}</h2>
                  <p className="text-[13px] text-[#9fa4b4] mt-1">{t("profile.personalInfoSubtitle")}</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`h-10 px-5 text-[13px] font-[600] ${
                    isEditing ? "bg-[#f8f8f8] border border-[#dedede] text-[#494e60] hover:bg-[#f0f0f0]" : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  {isEditing ? t("profile.cancel") : t("profile.edit")}
                </Button>
              </div>

              <div className="p-6">
                {/* Profile Picture Section */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 mb-6 border-b border-[#dedede]">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-[28px] font-bold shrink-0">
                        {displayPicture ? (
                          <img src={displayPicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          user ? getUserInitials(user) : ""
                        )}
                      </div>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                        <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handlePictureSelect} className="hidden" />
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                        <span className="text-white text-[11px] font-[500]">
                          {displayPicture ? t("profile.changePhoto") : t("profile.uploadPhoto")}
                        </span>
                      </label>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-[600] text-[#494e60]">{t("profile.profilePicture")}</h3>
                      <p className="text-[13px] text-[#9fa4b4] mt-1">{t("profile.pictureHint")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <label className="inline-block">
                          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handlePictureSelect} className="hidden" />
                          <span className="inline-flex items-center justify-center h-10 px-4 bg-primary hover:bg-primary/90 text-white text-[13px] font-[600] rounded-md cursor-pointer transition-colors">
                            {displayPicture ? t("profile.changePhotoButton") : t("profile.selectPhoto")}
                          </span>
                        </label>
                        {displayPicture && (
                          <button type="button" onClick={handleRemovePicture} className="inline-flex items-center justify-center h-10 px-4 border border-red-500 text-red-600 hover:bg-red-50 text-[13px] font-[600] rounded-md transition-colors">
                            {t("profile.removePhoto")}
                          </button>
                        )}
                      </div>
                      {pictureError && <p className="mt-2 text-[13px] text-red-600">{pictureError}</p>}
                    </div>
                  </div>
                )}

                <form onSubmit={onProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(["firstName", "lastName", "email", "phone"] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-[13px] font-[600] text-[#494e60] mb-2">
                          {t(field === "firstName" ? "common.firstName" : field === "lastName" ? "common.lastName" : field === "email" ? "common.email" : "common.phone")}
                        </label>
                        {isEditing ? (
                          <Input
                            {...profileForm.register(field)}
                            type={field === "email" ? "email" : "text"}
                            className={formInputClass}
                          />
                        ) : (
                          <p className="text-[15px] text-[#494e60] py-2">{profileForm.watch(field)}</p>
                        )}
                      </div>
                    ))}

                    <div>
                      <label className="block text-[13px] font-[600] text-[#494e60] mb-2">{t("profile.dateOfBirth")}</label>
                      {isEditing ? (
                        <Controller
                          name="dateOfBirth"
                          control={profileForm.control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={t("datePicker.placeholder")}
                              inputClassName={formInputClass}
                            />
                          )}
                        />
                      ) : (
                        <p className="text-[15px] text-[#494e60] py-2">{formatDate(profileForm.watch("dateOfBirth"))}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-[600] text-[#494e60] mb-2">{t("auth.signin.gender")}</label>
                      {isEditing ? (
                        <Controller
                          name="gender"
                          control={profileForm.control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className={formInputClass}>
                                <SelectValue placeholder={t("common.selectGender")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mashkull">{t("common.genderMale")}</SelectItem>
                                <SelectItem value="Femër">{t("common.genderFemale")}</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      ) : (
                        <p className="text-[15px] text-[#494e60] py-2">{profileForm.watch("gender")}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[13px] font-[600] text-[#494e60] mb-2">{t("profile.address")}</label>
                      {isEditing ? (
                        <Input {...profileForm.register("address")} className={formInputClass} />
                      ) : (
                        <p className="text-[15px] text-[#494e60] py-2">{profileForm.watch("address") || "—"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[13px] font-[600] text-[#494e60] mb-2">{t("common.city")}</label>
                      {isEditing ? (
                        <Controller
                          name="city"
                          control={profileForm.control}
                          render={({ field }) => (
                            <Select value={field.value || "__none__"} onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}>
                              <SelectTrigger className={formInputClass}>
                                <SelectValue placeholder={t("common.selectCity")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">{t("common.selectCity")}</SelectItem>
                                {cities.map((c) => (
                                  <SelectItem key={c.id} value={c.name}>{c.name} ({c.postcode})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      ) : (
                        <p className="text-[15px] text-[#494e60] py-2">{profileForm.watch("city") || "—"}</p>
                      )}
                    </div>
                  </div>

                  {saveError && <p className="mt-4 text-[14px] text-red-600">{saveError}</p>}
                  {isEditing && (
                    <div className="mt-6 pt-6 border-t border-[#dedede] flex gap-3">
                      <Button type="submit" disabled={profileForm.formState.isSubmitting} className="h-11 px-6 bg-primary hover:bg-primary/90 text-white text-[14px] font-[600] disabled:opacity-60">
                        {profileForm.formState.isSubmitting ? t("profile.saving") : t("profile.saveChanges")}
                      </Button>
                      <Button type="button" onClick={() => setIsEditing(false)} className="h-11 px-6 bg-white border border-[#dedede] text-[#494e60] text-[14px] font-[600] hover:bg-[#f8f8f8]">
                        {t("profile.cancel")}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white border border-[#dedede] mt-6">
              <div className="px-6 py-5 border-b border-[#dedede]">
                <h2 className="text-[18px] font-[600] text-[#494e60]">{t("profile.security")}</h2>
                <p className="text-[13px] text-[#9fa4b4] mt-1">{t("profile.securitySubtitle")}</p>
              </div>
              <div className="p-6">
                {!showPasswordForm ? (
                  <Button onClick={() => setShowPasswordForm(true)} className="h-11 px-6 bg-[#f8f8f8] border border-[#dedede] text-[#494e60] text-[14px] font-[600] hover:bg-[#f0f0f0]">
                    {t("profile.changePassword")}
                  </Button>
                ) : (
                  <form onSubmit={onPasswordSubmit} className="space-y-4 max-w-md">
                    {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-[13px] font-[600] text-[#494e60] mb-2">
                          {t(field === "currentPassword" ? "profile.currentPassword" : field === "newPassword" ? "profile.newPassword" : "profile.confirmNewPassword")}
                        </label>
                        <Controller
                          name={field}
                          control={passwordForm.control}
                          render={({ field: f }) => (
                            <PasswordInput
                              value={f.value}
                              onChange={(e) => f.onChange(e.target.value)}
                              placeholder={t(field === "currentPassword" ? "profile.currentPasswordPlaceholder" : field === "newPassword" ? "profile.newPasswordPlaceholder" : "profile.confirmNewPasswordPlaceholder")}
                              className={formInputClass}
                            />
                          )}
                        />
                      </div>
                    ))}
                    {passwordError && <p className="text-[14px] text-red-600">{passwordError}</p>}
                    {passwordSuccess && <p className="text-[14px] text-green-600">{passwordSuccess}</p>}
                    <div className="flex gap-3">
                      <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="h-11 px-6 bg-primary hover:bg-primary/90 text-white text-[14px] font-[600] disabled:opacity-60">
                        {passwordForm.formState.isSubmitting ? t("profile.passwordChanging") : t("profile.changePassword")}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          passwordForm.reset();
                          setPasswordError(null);
                          setPasswordSuccess(null);
                        }}
                        disabled={passwordForm.formState.isSubmitting}
                        className="h-11 px-6 bg-white border border-[#dedede] text-[#494e60] text-[14px] font-[600] hover:bg-[#f8f8f8]"
                      >
                        {t("profile.cancel")}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
