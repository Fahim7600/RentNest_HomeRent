"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLandlordProperties, deleteProperty } from "../actions";
import { formatImageUrl } from "@/lib/image";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Tag,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import type { Property } from "@/lib/types";

export function LandlordPropertyList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["landlord-properties", page],
    queryFn: () => fetchLandlordProperties({ page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success("Property deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message || "Failed to delete property");
      } else {
        toast.error("Failed to delete property");
      }
    },
    onSettled: () => setDeletingId(null),
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Building2 className="h-5 w-5 text-indigo-400" />
            My Property Listings
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Create, update, and manage your residential rental properties.
          </p>
        </div>

        <Link
          href="/dashboard/landlord/properties/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500"
        >
          <Plus className="h-4 w-4" />
          Add New Property
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40"
            />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-xs text-red-400">Failed to load property listings.</p>
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
            No properties listed yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 mb-4">
            Click &quot;Add New Property&quot; to post your first rental listing.
          </p>
          <Link
            href="/dashboard/landlord/properties/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Post First Property
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {data.properties.map((prop) => {
              const imageSrc = formatImageUrl(prop.images?.[0]);
              const rent = prop.rentAmount ?? prop.price ?? 0;

              return (
                <div
                  key={prop.id}
                  className="flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 transition-all hover:border-slate-700"
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 sm:h-auto sm:w-40 shrink-0 bg-slate-800">
                    <Image
                      src={imageSrc}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white text-sm line-clamp-1">
                          {prop.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            prop.availability === "AVAILABLE" || prop.isAvailable
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {prop.availability || (prop.isAvailable ? "AVAILABLE" : "RENTED")}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                        <span className="line-clamp-1">{prop.location}</span>
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="font-bold text-white text-sm">
                          ${rent.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/mo</span>
                        </span>
                        {prop.category?.name && (
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-indigo-300">
                            {prop.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3">
                      <Link
                        href={`/dashboard/landlord/properties/${prop.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5 text-indigo-400" />
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(prop.id, prop.title)}
                        disabled={deletingId === prop.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        {deletingId === prop.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
