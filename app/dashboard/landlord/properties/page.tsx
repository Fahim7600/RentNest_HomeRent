import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/app/_components/navbar";
import { LandlordPropertyList } from "../_components/landlord-property-list";

export const metadata: Metadata = {
  title: "My Properties — Landlord Dashboard",
  description: "Manage your listed rental properties.",
};

export default function LandlordPropertiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/dashboard/landlord"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Landlord Portal
          </Link>

          <LandlordPropertyList />
        </div>
      </main>
    </div>
  );
}
