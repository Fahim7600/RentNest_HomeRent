import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Lightweight user shape stored in the "rentnest_user" cookie
// ---------------------------------------------------------------------------
interface CookieUser {
  id: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  name: string;
}

// ---------------------------------------------------------------------------
// Role-to-dashboard mapping
// ---------------------------------------------------------------------------
const ROLE_DASHBOARD: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

// ---------------------------------------------------------------------------
// Route → allowed role(s)
// ---------------------------------------------------------------------------
function getAllowedRole(pathname: string): string | null {
  if (pathname.startsWith("/dashboard/tenant")) return "TENANT";
  if (pathname.startsWith("/dashboard/landlord")) return "LANDLORD";
  if (pathname.startsWith("/dashboard/admin")) return "ADMIN";
  return null;
}

// ---------------------------------------------------------------------------
// Parse the rentnest_user cookie
// ---------------------------------------------------------------------------
function parseUserCookie(raw: string | undefined): CookieUser | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded) as CookieUser;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Proxy (previously called middleware)
// ---------------------------------------------------------------------------
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard/* routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Read auth cookies
  const token = request.cookies.get("rentnest_token")?.value;
  const user = parseUserCookie(request.cookies.get("rentnest_user")?.value);

  // ── Unauthenticated → redirect to login ──
  if (!token || !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Role boundary check ──
  const requiredRole = getAllowedRole(pathname);

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the user's own dashboard instead of 403
    const correctDashboard = ROLE_DASHBOARD[user.role];
    if (correctDashboard) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = correctDashboard;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher — only run proxy for dashboard routes
// ---------------------------------------------------------------------------
export const config = {
  matcher: ["/dashboard/:path*"],
};
