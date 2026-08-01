import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route-protection proxy.
 *
 * This file lives at the project root (NOT /app) and is NOT named
 * middleware.ts — Next.js 16+ auto-discovers proxy.ts and invokes
 * the default export for every matched request.
 *
 * For now it's a no-op pass-through.
 */
export default function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *  - _next/static (static files)
     *  - _next/image  (image optimization)
     *  - favicon.ico  (browser favicon)
     *  - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
