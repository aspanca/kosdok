import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type UserType = "patient" | "clinic";

interface BaseUser {
  id: string;
  email: string;
  type: UserType;
  firstName: string;
  lastName: string;
}

interface PatientUser extends BaseUser {
  type: "patient";
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface ClinicUser extends BaseUser {
  type: "clinic";
  clinicName: string;
  logo?: string;
  phone?: string;
  address?: string;
  city?: string;
}

type User = PatientUser | ClinicUser;

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isPatient: boolean;
  isClinic: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "kosdok_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get initial user from localStorage
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredUser);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isPatient = user?.type === "patient";
  const isClinic = user?.type === "clinic";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isPatient,
        isClinic,
        login,
        logout,
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

// Type guards for user types
export const isPatientUser = (user: User | null): user is PatientUser => {
  return user?.type === "patient";
};

export const isClinicUser = (user: User | null): user is ClinicUser => {
  return user?.type === "clinic";
};

export type { User, PatientUser, ClinicUser, UserType };
