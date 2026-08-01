"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminProperties } from "../actions";
import {
  Building2,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export function AdminPropertyList() {
  const [availabilityFilter, setAvailabilityFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-properties", availabilityFilter, page],
    queryFn: () => fetchAdminProperties({ availability: availabilityFilter, page, limit: 10 }),
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Building2 className="h-5 w-5 text-indigo-400" />
            Platform Property Oversight
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Read-only audit view of all properties published across the platform.
          </p>
        </div>

        {/* Availability Filter */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-white">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={availabilityFilter || ""}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="bg-transparent outline-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">All Statuses</option>
            <option value="AVAILABLE" className="bg-slate-900">Available</option>
            <option value="RENTED" className="bg-slate-900">Rented</option>
            <option value="MAINTENANCE" className="bg-slate-900">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40"
            />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-xs text-red-400">Failed to load platform properties.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      ) : data.properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-12 text-center">
          <Building2 className="h-10 w-10 text-slate-600" />
          <h3 className="mt-3 text-sm font-semibold text-slate-300">
            No properties found
          </h3>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/40 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Landlord</th>
                <th className="px-4 py-3 font-medium">Monthly Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.properties.map((prop) => {
                const rent = prop.rentAmount ?? prop.price ?? 0;
                return (
                  <tr key={prop.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Property Title & Location */}
                    <td className="px-4 py-4">
                      <div>
                        <Link
                          href={`/properties/${prop.id}`}
                          className="font-semibold text-white hover:text-indigo-400 line-clamp-1 transition-colors text-xs"
                        >
                          {prop.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="line-clamp-1">{prop.location}</span>
                        </p>
                      </div>
                    </td>

                    {/* Landlord Info */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <User className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <span>{prop.landlord?.name || `ID: ${prop.landlordId.slice(0, 8)}...`}</span>
                      </div>
                    </td>

                    {/* Rent Amount */}
                    <td className="px-4 py-4 font-bold text-white text-xs">
                      ${rent.toLocaleString()} / mo
                    </td>

                    {/* Availability */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          prop.availability === "AVAILABLE" || prop.isAvailable
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {prop.availability || (prop.isAvailable ? "AVAILABLE" : "RENTED")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
              <span>
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                  disabled={page >= data.meta.totalPages}
                  className="flex items-center gap-1 rounded-lg border border-slate-800 px-2.5 py-1 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
