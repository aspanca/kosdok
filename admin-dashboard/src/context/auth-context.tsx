import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getAccessToken, setTokens, clearTokens } from "../lib/axios";
import * as api from "../lib/api";

type AdminUser = { id: number; email: string; name?: string; type: "admin" };

type AuthContextValue = {
  user: AdminUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (getAccessToken()) return { id: 0, email: "", type: "admin" };
    return null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.adminLogin(email, password) as { user: AdminUser; accessToken: string; refreshToken: string };
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user as AdminUser);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!getAccessToken()) return;
    try {
      const u = await api.adminGetMe() as AdminUser;
      setUser(u);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.email || !!getAccessToken(),
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
