import Cookies from "js-cookie";

const TOKEN_KEY = "rentnest_token";
const USER_KEY = "rentnest_user";

// ---------------------------------------------------------------------------
// Lightweight user shape stored in cookie for quick reads (proxy, nav, etc.)
// ---------------------------------------------------------------------------
export interface CookieUser {
  id: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  name: string;
}

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

/** Retrieve the JWT from the cookie. */
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

/**
 * Store the JWT in a cookie.
 * Expires in 7 days — matches typical backend token lifetimes.
 */
export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    path: "/",
    sameSite: "lax",
  });
}

/** Remove the JWT cookie (logout). */
export function clearToken(): void {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}

// ---------------------------------------------------------------------------
// User cookie helpers
// ---------------------------------------------------------------------------

/** Retrieve the lightweight user from the cookie. */
export function getUser(): CookieUser | undefined {
  const raw = Cookies.get(USER_KEY);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as CookieUser;
  } catch {
    return undefined;
  }
}

/** Store a lightweight user object in a cookie. */
export function setUser(user: CookieUser): void {
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 7,
    path: "/",
    sameSite: "lax",
  });
}

/** Remove the user cookie (logout). */
export function clearUser(): void {
  Cookies.remove(USER_KEY, { path: "/" });
}

/** Clear both auth cookies at once (full logout). */
export function clearAuth(): void {
  clearToken();
  clearUser();
}
