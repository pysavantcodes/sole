"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authAPI, type LoginInput, type RegisterInput, type User } from "../api";
import { authCookies } from "../api/cookies";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<{ message?: string }>;
  logout: () => Promise<void>;
  setAuthUser: (nextUser: User | null) => void;
  setSession: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
};

export const AuthProvider = ({
  children,
  initialUser = null,
  initialToken = null,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const login = useCallback(async (payload: LoginInput) => {
    const response = await authAPI.login(payload);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterInput) => {
    const response = await authAPI.register(payload);
    return { message: response.message };
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
    setToken(null);
    setUser(null);
  }, []);

  const setAuthUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
  }, []);

  const setSession = useCallback((nextToken: string, nextUser: User) => {
    authCookies.setToken(nextToken);
    authCookies.setUser(nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      login,
      register,
      logout,
      setAuthUser,
      setSession,
    }),
    [user, token, isBootstrapping, login, register, logout, setAuthUser, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
