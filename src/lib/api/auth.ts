import { apiFetch } from "./client";
import type { AuthTokens, AuthUser, RegisterInput } from "./types";

/**
 * /api/auth/token/ is the stock simplejwt TokenObtainPairView with no custom
 * serializer or auth backend, so it authenticates against Django's default
 * User.USERNAME_FIELD (username) — not email.
 */
export function login(username: string, password: string) {
  return apiFetch<AuthTokens>("/api/auth/token/", {
    method: "POST",
    body: { username, password },
  });
}

export function getCurrentUser() {
  return apiFetch<AuthUser>("/api/auth/me/", { auth: true });
}

/**
 * Confirmed against RegisterSerializer (users/serializers.py in oghie-store):
 * fields are username/email/password (Django's default auth.User model, so
 * username is required); the response is the created user, not tokens
 * (register() below always follows up with an explicit login()).
 */
export function register(input: RegisterInput) {
  return apiFetch<AuthUser>("/api/auth/register/", {
    method: "POST",
    body: input,
  });
}
