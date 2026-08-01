"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Building2,
  LogIn,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
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
    setUser(getToken() ? getUser() : undefined);
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(undefined);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white"
        >
          <Building2 className="h-6 w-6 text-indigo-400" />
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            RentNest
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/" icon={<Home className="h-4 w-4" />}>
            Home
          </NavLink>
          <NavLink
            href="/properties"
            icon={<Building2 className="h-4 w-4" />}
          >
            Properties
          </NavLink>

          {mounted && user ? (
            <>
              <NavLink
                href={dashboardPath(user.role)}
                icon={<LayoutDashboard className="h-4 w-4" />}
              >
                Dashboard
              </NavLink>

              <div className="ml-3 flex items-center gap-3 border-l border-slate-700 pl-4">
                <span className="text-sm text-slate-300">
                  {user.name}
                  <span className="ml-1.5 rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-400">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-red-500/50 hover:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </>
          ) : mounted ? (
            <div className="ml-3 flex items-center gap-2 border-l border-slate-700 pl-4">
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:from-indigo-500 hover:to-violet-500"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Register
              </Link>
            </div>
          ) : null}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-400 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            <MobileNavLink
              href="/"
              icon={<Home className="h-4 w-4" />}
              onClick={() => setIsOpen(false)}
            >
              Home
            </MobileNavLink>
            <MobileNavLink
              href="/properties"
              icon={<Building2 className="h-4 w-4" />}
              onClick={() => setIsOpen(false)}
            >
              Properties
            </MobileNavLink>

            {mounted && user ? (
              <>
                <MobileNavLink
                  href={dashboardPath(user.role)}
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </MobileNavLink>

                <div className="mt-2 border-t border-slate-800 pt-3">
                  <p className="mb-2 px-3 text-sm text-slate-400">
                    {user.name}{" "}
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-400">
                      {user.role}
                    </span>
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : mounted ? (
              <div className="mt-2 flex flex-col gap-2 border-t border-slate-800 pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-slate-600"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
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
// Sub-components
// ---------------------------------------------------------------------------
function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
    >
      {icon}
      {children}
    </Link>
  );
}
