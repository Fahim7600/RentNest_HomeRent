import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-2xl">
            <SearchX className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-indigo-400 border border-slate-700">
              404 — Page Not Found
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Lost in Nest Space?
            </h1>
            <p className="text-sm text-slate-400">
              The rental page or dashboard route you are searching for does not exist or has been moved.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:from-indigo-500 hover:to-violet-500"
            >
              <Home className="h-4 w-4" />
              Back to Home Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
