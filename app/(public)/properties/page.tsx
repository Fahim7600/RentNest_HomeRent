import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyFilters } from "./_components/property-filters";
import { PropertyGrid } from "./_components/property-grid";

export const metadata: Metadata = {
  title: "Browse Properties — RentNest",
  description:
    "Filter and explore verified rental homes, apartments, and studios by location, category, and budget.",
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Explore Available Properties
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Find verified homes tailored to your preferences and budget.
          </p>
        </div>

        {/* Layout Grid: Sidebar + Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-slate-900" />}>
              <PropertyFilters />
            </Suspense>
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-900" />}>
              <PropertyGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
