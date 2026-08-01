"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Menu, X } from "lucide-react";
import { getUser, getToken, clearAuth, type CookieUser } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Role-aware dashboard path
// ---------------------------------------------------------------------------
function dashboardPath(role: string): string {
  return `/dashboard/${role.toLowerCase()}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<CookieUser | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read cookies client-side only (avoids hydration mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getToken() ? getUser() : undefined);
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(undefined);
    router.push("/");
  };

  const gradientStyle = {
    background:
      "radial-gradient(ellipse at 18% 50%, rgba(217, 138, 61, 0.45) 0%, transparent 60%), linear-gradient(110deg, #c9702f 0%, #4a2818 20%, #14241b 55%, #0a1410 100%)",
  };

  return (
    <nav className="sticky top-0 z-50 py-3 px-4 sm:px-6 lg:px-8">
      <div
        style={gradientStyle}
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 rounded-full border border-white/15 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Building2 className="h-5 w-5 text-white/80 stroke-[1.5]" />
          <span className="text-sm font-bold tracking-tight text-white">
            RentNest
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden items-center gap-7 md:flex">
          <NavLink href="/">HOME</NavLink>
          <NavLink href="/properties">PROPERTIES</NavLink>

          {mounted && user ? (
            <>
              <NavLink href={dashboardPath(user.role)}>DASHBOARD</NavLink>

              <div className="ml-2 flex items-center gap-4 border-l border-white/15 pl-6">
                <span className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-wider text-white/90">
                  <span>{user.name}</span>
                  <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/90">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="font-mono text-[13px] uppercase tracking-wider text-white/70 hover:text-red-300 transition-opacity hover:opacity-100"
                >
                  LOGOUT
                </button>
              </div>
            </>
          ) : mounted ? (
            <div className="ml-2 flex items-center gap-6 border-l border-white/15 pl-6">
              <Link
                href="/login"
                className="font-mono text-[13px] uppercase tracking-wider text-white/80 hover:text-white transition-opacity hover:opacity-100"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-950 border border-white/20 px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-white shadow-lg transition-all hover:bg-slate-900 hover:border-white/40"
              >
                REGISTER
              </Link>
            </div>
          ) : null}
        </div>

        {/* ── Mobile Hamburger Button ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-2 text-white/80 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Expanded Panel ── */}
      {isOpen && (
        <div
          style={gradientStyle}
          className="mx-auto mt-2 max-w-6xl rounded-3xl border border-white/15 p-5 shadow-2xl md:hidden space-y-3"
        >
          <div className="flex flex-col gap-2">
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
              HOME
            </MobileNavLink>
            <MobileNavLink href="/properties" onClick={() => setIsOpen(false)}>
              PROPERTIES
            </MobileNavLink>

            {mounted && user ? (
              <>
                <MobileNavLink
                  href={dashboardPath(user.role)}
                  onClick={() => setIsOpen(false)}
                >
                  DASHBOARD
                </MobileNavLink>

                <div className="mt-2 border-t border-white/15 pt-3 flex flex-col gap-2">
                  <div className="px-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/90">
                    <span>{user.name}</span>
                    <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] text-white/90">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left px-3 py-2 font-mono text-xs uppercase tracking-wider text-red-300 hover:text-red-200 transition-opacity hover:opacity-80"
                  >
                    LOGOUT
                  </button>
                </div>
              </>
            ) : mounted ? (
              <div className="mt-2 flex flex-col gap-2 border-t border-white/15 pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/80 hover:text-white"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-block rounded-full bg-slate-950 border border-white/20 px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-center text-white shadow-lg"
                >
                  REGISTER
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Helper Sub-components
// ---------------------------------------------------------------------------
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-mono text-[13px] uppercase tracking-wider text-white/80 hover:text-white transition-opacity hover:opacity-100"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/80 hover:text-white transition-opacity hover:opacity-100"
    >
      {children}
    </Link>
  );
}
