import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getAccessToken, setTokens, clearTokens } from "../lib/axios";
import * as authApi from "../lib/api/auth";
import { mapRawUserToUser } from "../lib/user-mapper";
import type {
  User,
  PatientUser,
  ClinicUser,
  UserType,
  PatientRegisterPayload,
  ClinicRegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../lib/types";

const AUTH_STORAGE_KEY = "kosdok_user";

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  isPatient: boolean;
  isClinic: boolean;
  isLoading: boolean;
  login: (user: User, accessToken?: string, refreshToken?: string) => void;
  logout: () => void;
  registerPatient: (payload: PatientRegisterPayload) => Promise<{ message: string } | void>;
  registerClinic: (payload: ClinicRegisterPayload) => Promise<void>;
  signIn: (email: string, password: string) => Promise<User>;
  signInClinic: (email: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);

  const persistUser = useCallback((u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    (userData: User, accessToken?: string, refreshToken?: string) => {
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);
      }
      persistUser(userData);
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    clearTokens();
    persistUser(null);
  }, [persistUser]);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) return;
    try {
      const data = await authApi.getMe();
      persistUser(data);
    } catch {
      logout();
    }
  }, [persistUser, logout]);

  useEffect(() => {
    if (user && getAccessToken()) {
      fetchUser().catch(() => {});
    }
  }, []);

  const registerPatient = useCallback(
    async (payload: PatientRegisterPayload) => {
      const data = await authApi.registerPatient(payload);
      if (data.message) {
        return { message: data.message };
      }
      if (data.accessToken && data.refreshToken && data.user) {
        const mapped = mapRawUserToUser(data.user);
        login(mapped, data.accessToken, data.refreshToken);
      }
    },
    [login]
  );

  const registerClinic = useCallback(
    async (payload: ClinicRegisterPayload) => {
      const data = await authApi.registerClinic(payload);
      if (data.accessToken && data.refreshToken && data.user) {
        const mapped = mapRawUserToUser(data.user);
        login(mapped, data.accessToken, data.refreshToken);
      }
    },
    [login]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const data = await authApi.login({ email, password });
      if (data.accessToken && data.refreshToken && data.user) {
        const mapped = mapRawUserToUser(data.user);
        login(mapped, data.accessToken, data.refreshToken);
        return mapped;
      }
      throw new Error("Invalid response");
    },
    [login]
  );

  const signInClinic = useCallback(
    async (email: string, password: string) => {
      const data = await authApi.login({ email, password });
      if (data.accessToken && data.refreshToken && data.user) {
        const mapped = mapRawUserToUser(data.user);
        if (mapped.type !== "clinic") throw new Error("Ky llogari nuk është për klinikë");
        login(mapped, data.accessToken, data.refreshToken);
      } else {
        throw new Error("Invalid response");
      }
    },
    [login]
  );

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      const data = await authApi.updateProfile(payload);
      persistUser(data);
    },
    [persistUser]
  );

  const uploadProfilePicture = useCallback(
    async (file: File) => {
      const data = await authApi.uploadProfilePicture(file);
      persistUser(data);
    },
    [persistUser]
  );

  const changePassword = useCallback(async (payload: ChangePasswordPayload) => {
    await authApi.changePassword(payload);
  }, []);

  const verifyEmail = useCallback(
    async (token: string) => {
      const data = await authApi.verifyEmail(token);
      if (data.accessToken && data.refreshToken && data.user) {
        const mapped = mapRawUserToUser(data.user);
        login(mapped, data.accessToken, data.refreshToken);
      } else {
        throw new Error("Verifikimi dështoi");
      }
    },
    [login]
  );

  const isPatient = user?.type === "patient";
  const isClinic = user?.type === "clinic";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isPatient,
        isClinic,
        isLoading: false,
        login,
        logout,
        registerPatient,
        registerClinic,
        signIn,
        signInClinic,
        verifyEmail,
        fetchUser,
        updateProfile,
        uploadProfilePicture,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const isPatientUser = (user: User | null): user is PatientUser => user?.type === "patient";
export const isClinicUser = (user: User | null): user is ClinicUser => user?.type === "clinic";

export function getUserDisplayName(user: User): string {
  return user.type === "patient" ? `${user.firstName} ${user.lastName}` : user.clinicName;
}

export function getUserInitials(user: User): string {
  if (user.type === "patient") {
    return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  }
  return user.clinicName.slice(0, 2).toUpperCase();
}

export function getUserPicture(user: User): string | undefined {
  return user.type === "patient" ? user.picture : user.avatar;
}

export type { User, PatientUser, ClinicUser, UserType };
