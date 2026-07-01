import type { AuthTokens } from "./types";

/**
 * Tokens live in memory only — never localStorage (XSS risk). This means a
 * hard page refresh drops the session; wire this up to an httpOnly refresh
 * cookie from the backend once that's confirmed, instead of persisting the
 * refresh token client-side.
 */
let tokens: AuthTokens | null = null;
const listeners = new Set<(tokens: AuthTokens | null) => void>();

export function getTokens() {
  return tokens;
}

export function setTokens(next: AuthTokens | null) {
  tokens = next;
  listeners.forEach((listener) => listener(tokens));
}

export function subscribeToTokens(listener: (tokens: AuthTokens | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
