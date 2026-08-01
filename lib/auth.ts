import Cookies from "js-cookie";

const TOKEN_KEY = "rentnest_token";

/**
 * Retrieve the JWT from the cookie.
 */
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

/**
 * Store the JWT in a cookie.
 * Expires in 7 days by default — matches typical backend token lifetimes.
 */
export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Remove the JWT cookie (logout).
 */
export function clearToken(): void {
  Cookies.remove(TOKEN_KEY, { path: "/" });
}
