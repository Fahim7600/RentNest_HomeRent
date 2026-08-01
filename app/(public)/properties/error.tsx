"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Properties route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 max-w-md w-full">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-white">Something went wrong</h2>
        <p className="mt-2 text-xs text-slate-400">
          Unable to load properties list right now. Please check your connection and try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
