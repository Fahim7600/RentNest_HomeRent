"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";

export default function PropertyDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Property detail route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 max-w-md w-full">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-white">Could not load property details</h2>
        <p className="mt-2 text-xs text-slate-400">
          This property listing may be unavailable or there was a network error.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Properties
          </Link>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
