"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTokens, setTokens, subscribeToTokens } from "@/lib/api/token-store";
import { login as loginRequest } from "@/lib/api/auth";
import type { AuthTokens } from "@/lib/api/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setLocalTokens] = useState<AuthTokens | null>(() => getTokens());
  const queryClient = useQueryClient();

  useEffect(() => subscribeToTokens(setLocalTokens), []);

  const login = async (email: string, password: string) => {
    const nextTokens = await loginRequest(email, password);
    setTokens(nextTokens);
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  };

  const logout = () => {
    setTokens(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
    queryClient.removeQueries({ queryKey: ["cart"] });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(tokens?.access), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
