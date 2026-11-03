import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser, LoginPayload, RegisterPayload } from "../types/auth";

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getProfile,
} from "../services/authService";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mengecek token saat aplikasi pertama kali dibuka
  useEffect(() => {
    async function restoreSession() {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        // Token tidak valid atau tidak tersedia
        await logoutService();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(payload: LoginPayload) {
    const loggedInUser = await loginService(payload);
    setUser(loggedInUser);
  }

  async function register(payload: RegisterPayload) {
    const registeredUser = await registerService(payload);
    setUser(registeredUser);
  }

  async function logout() {
    await logoutService();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}