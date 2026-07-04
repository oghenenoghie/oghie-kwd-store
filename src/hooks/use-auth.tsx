"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTokens, setTokens, subscribeToTokens } from "@/lib/api/token-store";
import { login as loginRequest, register as registerRequest } from "@/lib/api/auth";
import type { AuthTokens, RegisterInput } from "@/lib/api/types";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setLocalTokens] = useState<AuthTokens | null>(() => getTokens());
  const queryClient = useQueryClient();

  useEffect(() => subscribeToTokens(setLocalTokens), []);

  const login = async (username: string, password: string) => {
    const nextTokens = await loginRequest(username, password);
    setTokens(nextTokens);
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  };

  // register() doesn't assume the backend logs the user in, so it always
  // follows up with an explicit login() to establish the session.
  const register = async (input: RegisterInput) => {
    await registerRequest(input);
    await login(input.username, input.password);
  };

  const logout = () => {
    setTokens(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
    queryClient.removeQueries({ queryKey: ["cart"] });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: Boolean(tokens?.access), login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
