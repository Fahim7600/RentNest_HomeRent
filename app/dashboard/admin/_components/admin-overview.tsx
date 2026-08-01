"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchAdminProperties,
  fetchAdminRentals,
  fetchAdminPayments,
} from "../actions";
import {
  Users,
  Building2,
  FileText,
  CreditCard,
  Tag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function AdminOverview() {
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-users-overview"],
    queryFn: () => fetchUsers({ limit: 1 }),
  });

  const { data: propertiesData, isLoading: isLoadingProps } = useQuery({
    queryKey: ["admin-properties-overview"],
    queryFn: () => fetchAdminProperties({ limit: 1 }),
  });

  const { data: pendingRentalsData, isLoading: isLoadingRentals } = useQuery({
    queryKey: ["admin-pending-rentals-overview"],
    queryFn: () => fetchAdminRentals({ status: "PENDING", limit: 1 }),
  });

  const { data: paymentsData, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["admin-payments-overview"],
    queryFn: () => fetchAdminPayments({ limit: 1 }),
  });

  const totalUsers = usersData?.meta.total ?? 0;
  const totalProperties = propertiesData?.meta.total ?? 0;
  const pendingRentals = pendingRentalsData?.meta.total ?? 0;
  const totalPayments = paymentsData?.meta.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Platform Metric Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoadingUsers ? (
              <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
            ) : (
              <span className="text-3xl font-extrabold text-white">{totalUsers}</span>
            )}
            <p className="mt-1 text-xs text-slate-400">Tenants, Landlords & Admins</p>
          </div>
        </div>

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
            <p className="mt-1 text-xs text-slate-400">Listed across platform</p>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoadingRentals ? (
              <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
            ) : (
              <span className="text-3xl font-extrabold text-amber-400">
                {pendingRentals}
              </span>
            )}
            <p className="mt-1 text-xs text-slate-400">Applications in review</p>
          </div>
        </div>

        {/* Total Payments */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Transactions
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {isLoadingPayments ? (
              <div className="h-8 w-16 animate-pulse rounded bg-slate-800" />
            ) : (
              <span className="text-3xl font-extrabold text-emerald-400">
                {totalPayments}
              </span>
            )}
            <p className="mt-1 text-xs text-slate-400">Payments recorded</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          Admin Quick Operations
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Users */}
          <Link
            href="/dashboard/admin/users"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              User Moderation
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Audit registered tenants and landlords, and toggle ban/unban statuses.
            </p>
          </Link>

          {/* Properties */}
          <Link
            href="/dashboard/admin/properties"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Building2 className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Property Oversight
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Audit listed rental properties across the platform.
            </p>
          </Link>

          {/* Rental Requests */}
          <Link
            href="/dashboard/admin/requests"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <FileText className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Rental Applications
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              View tenant rental requests and current agreement statuses.
            </p>
          </Link>

          {/* Category Management */}
          <Link
            href="/dashboard/admin/categories"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Tag className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Category Management
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Add, edit, or delete property categories used by landlords.
            </p>
          </Link>

          {/* Financial Transactions */}
          <Link
            href="/dashboard/admin/payments"
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Payment Transactions
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Audit payments and transaction history across all rentals.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
