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
      "radial-gradient(ellipse at 18% 50%, rgba(56, 189, 248, 0.45) 0%, transparent 65%), linear-gradient(110deg, #0284c7 0%, #1e3a8a 25%, #0f172a 60%, #020617 100%)",
  };

  return (
    <nav className="sticky top-0 z-50 py-3 px-4 sm:px-6 lg:px-8">
      <div
        style={gradientStyle}
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(2,132,199,0.25)] backdrop-blur-xl relative overflow-hidden"
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-all duration-300 hover:opacity-95"
        >
          <Building2 className="h-5 w-5 text-cyan-300 stroke-[1.5] drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
          <span className="text-sm font-bold tracking-tight text-white transition-colors group-hover:text-cyan-200">
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

              <div className="ml-2 flex items-center gap-4 border-l border-cyan-500/25 pl-6">
                <span className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-wider text-white/90">
                  <span>{user.name}</span>
                  <span className="rounded-full bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-200 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="font-mono text-[13px] uppercase tracking-wider text-white/70 transition-all duration-300 hover:text-red-300 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]"
                >
                  LOGOUT
                </button>
              </div>
            </>
          ) : mounted ? (
            <div className="ml-2 flex items-center gap-6 border-l border-cyan-500/25 pl-6">
              <Link
                href="/login"
                className="font-mono text-[13px] uppercase tracking-wider text-white/80 transition-all duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]"
              >
                SIGN IN
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-950/90 border border-cyan-400/40 px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-white shadow-lg transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-950/60 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.7)] hover:scale-105"
              >
                REGISTER
              </Link>
            </div>
          ) : null}
        </div>

        {/* ── Mobile Hamburger Button ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full p-2 text-white/80 hover:text-cyan-300 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Expanded Panel ── */}
      {isOpen && (
        <div
          style={gradientStyle}
          className="mx-auto mt-2 max-w-6xl rounded-3xl border border-cyan-400/30 p-5 shadow-[0_0_30px_rgba(2,132,199,0.3)] md:hidden space-y-3"
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

                <div className="mt-2 border-t border-cyan-500/25 pt-3 flex flex-col gap-2">
                  <div className="px-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/90">
                    <span>{user.name}</span>
                    <span className="rounded-full bg-cyan-500/15 border border-cyan-400/30 px-2 py-0.5 text-[10px] text-cyan-200">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-left px-3 py-2 font-mono text-xs uppercase tracking-wider text-red-300 hover:text-red-200 hover:drop-shadow-[0_0_6px_rgba(248,113,113,0.8)] transition-all"
                  >
                    LOGOUT
                  </button>
                </div>
              </>
            ) : mounted ? (
              <div className="mt-2 flex flex-col gap-2 border-t border-cyan-500/25 pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/80 hover:text-cyan-300 hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.8)] transition-all"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="inline-block rounded-full bg-slate-950/90 border border-cyan-400/40 px-5 py-2 font-mono text-xs uppercase tracking-wider font-semibold text-center text-white shadow-lg transition-all hover:border-cyan-300 hover:bg-cyan-950/60 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(56,189,248,0.6)]"
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
      className="font-mono text-[13px] uppercase tracking-wider text-white/80 transition-all duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]"
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
      className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/80 transition-all duration-300 hover:text-cyan-300 hover:drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]"
    >
      {children}
    </Link>
  );
}
