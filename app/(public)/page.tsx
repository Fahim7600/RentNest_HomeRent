import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Search,
  ShieldCheck,
  Zap,
  Key,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { fetchProperties } from "./properties/actions";
import { PropertyCard } from "./properties/_components/property-card";

export const metadata: Metadata = {
  title: "RentNest — Find & Rent Your Dream Home Seamlessly",
  description:
    "Explore premium rental homes, apartments, and studios. Transparent pricing, verified landlords, and instant rental requests.",
};

export default async function HomePage() {
  const { properties } = await fetchProperties({ limit: 6 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40 py-20 lg:py-32">
        {/* Glowing background highlights */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
          <div className="h-[350px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Modern Rental Ecosystem</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-tight">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Rental Nest
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              Discover verified rental properties, connect directly with landlords,
              and manage rental requests with absolute peace of mind.
            </p>

            {/* Quick Hero CTA Search */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/properties"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 sm:w-auto"
              >
                <Search className="h-5 w-5" />
                Browse All Properties
              </Link>
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 text-base font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 sm:w-auto"
              >
                List Your Property
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Explore Listings
              </span>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Featured Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View all properties
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 py-16 text-center">
              <Building2 className="h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-lg font-semibold text-slate-300">
                No properties available right now
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Check back soon or explore our property list.
              </p>
              <Link
                href="/properties"
                className="mt-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Explore Properties
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE RENTNEST ── */}
      <section className="border-t border-slate-800/80 bg-slate-900/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Tenants & Landlords Love RentNest
            </h2>
            <p className="mt-3 text-slate-400">
              Built to make home rentals transparent, safe, and modern.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                Verified Properties
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Every property listing undergoes verification for authentic details and images.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="inline-flex rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                Instant Requests
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Submit rental applications directly to landlords with custom messages and move-in dates.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="inline-flex rounded-xl bg-purple-500/10 p-3 text-purple-400">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                Role-Based Dashboards
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Tailored dashboards for tenants, landlords, and admins for seamless management.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
