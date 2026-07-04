import { apiFetch } from "./client";
import type { AuthTokens, AuthUser, RegisterInput } from "./types";

export function login(email: string, password: string) {
  return apiFetch<AuthTokens>("/api/auth/token/", {
    method: "POST",
    body: { email, password },
  });
}

export function getCurrentUser() {
  return apiFetch<AuthUser>("/api/auth/me/", { auth: true });
}

/**
 * Field-level shape is unconfirmed — the route map only lists POST
 * /api/auth/register/. Assumed to mirror AuthUser's email/first_name/last_name
 * fields plus password, and to return the created user rather than tokens
 * (register() below always follows up with an explicit login()).
 */
export function register(input: RegisterInput) {
  return apiFetch<AuthUser>("/api/auth/register/", {
    method: "POST",
    body: input,
  });
}
