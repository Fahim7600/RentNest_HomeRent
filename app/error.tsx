"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring services internally without exposing raw stack trace in UI
    console.error("Global Application Error:", error);
  }, [error]);

  const userFriendlyMessage =
    error?.message && !error.message.includes("digest")
      ? error.message
      : "Something went wrong while processing your request. Please try again.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 shadow-2xl">
            <AlertTriangle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
              Application Error
            </span>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Unexpected Error Occurred
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {userFriendlyMessage}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-indigo-400" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-violet-500 transition-all"
            >
              <Home className="h-4 w-4" />
              Go to Home Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
