import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Navbar } from "@/app/_components/navbar";
import { PropertyForm } from "../../_components/property-form";

export const metadata: Metadata = {
  title: "Add New Property — Landlord Portal",
  description: "Post a new residential property listing on RentNest.",
};

export default function NewPropertyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/dashboard/landlord/properties"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Properties
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6 border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Building2 className="h-6 w-6 text-indigo-400" />
                Post New Property
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Fill in property details, rent amount, and location to list it for prospective tenants.
              </p>
            </div>

            <PropertyForm />
          </div>
        </div>
      </main>
    </div>
  );
}
