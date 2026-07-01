import { apiFetch } from "./client";
import type { AuthTokens, AuthUser } from "./types";

export function login(email: string, password: string) {
  return apiFetch<AuthTokens>("/api/auth/token/", {
    method: "POST",
    body: { email, password },
  });
}

export function getCurrentUser() {
  return apiFetch<AuthUser>("/api/auth/me/", { auth: true });
}
