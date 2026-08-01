"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchLandlordProperties, fetchLandlordRequests } from "../actions";
import {
  Building2,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Home,
} from "lucide-react";

export function LandlordOverview() {
  const { data: propertiesData, isLoading: isLoadingProps } = useQuery({
    queryKey: ["landlord-properties-overview"],
    queryFn: () => fetchLandlordProperties({ limit: 1 }),
  });

  const { data: pendingData, isLoading: isLoadingPending } = useQuery({
    queryKey: ["landlord-pending-overview"],
    queryFn: () => fetchLandlordRequests({ status: "PENDING", limit: 1 }),
  });

  const { data: activeData, isLoading: isLoadingActive } = useQuery({
    queryKey: ["landlord-active-overview"],
    queryFn: () => fetchLandlordRequests({ status: "ACTIVE", limit: 1 }),
  });

  const totalProperties = propertiesData?.meta.total ?? 0;
  const pendingRequests = pendingData?.meta.total ?? 0;
  const activeRentals = activeData?.meta.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Properties */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Properties
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoadingProps ? (
              <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
            ) : (
              <span className="text-3xl font-extrabold text-white">
                {totalProperties}
              </span>
            )}
            <p className="mt-1 text-xs text-slate-400">Active listed rentals</p>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Applications
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoadingPending ? (
              <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
            ) : (
              <span className="text-3xl font-extrabold text-amber-400">
                {pendingRequests}
              </span>
            )}
            <p className="mt-1 text-xs text-slate-400">Awaiting your approval</p>
          </div>
        </div>

        {/* Active Leases */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Leases
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoadingActive ? (
              <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
            ) : (
              <span className="text-3xl font-extrabold text-emerald-400">
                {activeRentals}
              </span>
            )}
            <p className="mt-1 text-xs text-slate-400">Occupied & paid rentals</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link
          href="/dashboard/landlord/properties"
          className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Home className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            Manage Property Listings
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            View, edit details, or remove listed properties.
          </p>
        </Link>

        <Link
          href="/dashboard/landlord/requests"
          className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <FileText className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-violet-400 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            Incoming Applications
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Review applicant profiles and approve or reject requests.
          </p>
        </Link>

        <Link
          href="/dashboard/landlord/properties/new"
          className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Plus className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white">
            Post New Property
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            List a new apartment or house for prospective tenants.
          </p>
        </Link>
      </div>
    </div>
  );
}
