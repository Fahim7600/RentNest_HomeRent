import type { Metadata } from "next";
import { RegisterForm } from "./_components/register-form";
import { Home } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account — RentNest",
  description:
    "Create your RentNest account to start renting or listing properties.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-12">
      {/* Back to home */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Join RentNest and find your perfect rental
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
