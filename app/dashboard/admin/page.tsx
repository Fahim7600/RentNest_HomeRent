import type { Metadata } from "next";
import { Navbar } from "@/app/_components/navbar";
import { AdminOverview } from "./_components/admin-overview";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard — RentNest",
  description: "Platform oversight, user moderation, property audits, and category management.",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Portal
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                System-wide platform oversight, moderation, and category configuration.
              </p>
            </div>
          </div>

          <AdminOverview />
        </div>
      </main>
    </div>
  );
}
