import { API_BASE_URL } from "./env";
import { getTokens, setTokens } from "./token-store";
import type { AuthTokens } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const current = getTokens();
  if (!current?.refresh) return false;

  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: current.refresh }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = (await res.json()) as Partial<AuthTokens>;
        if (!data.access) return false;
        setTokens({ access: data.access, refresh: data.refresh ?? current.refresh });
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  /** Internal — set on the retried request to prevent infinite refresh loops. */
  _retried?: boolean;
}

/**
 * Shared fetch wrapper: every authenticated call goes through here so the
 * "401 -> refresh once -> retry -> else logout" flow lives in one place
 * instead of being duplicated per hook.
 */
export async function apiFetch<T>(
  path: string,
  { body, auth = false, headers, _retried, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const tokens = getTokens();
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (auth && tokens?.access) requestHeaders.set("Authorization", `Bearer ${tokens.access}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !_retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { body, auth, headers, _retried: true, ...init });
    }
    setTokens(null);
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(`Request to ${path} failed with ${res.status}`, res.status, errorBody);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
