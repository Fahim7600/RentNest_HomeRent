"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProperties } from "../actions";
import { PropertyCard } from "./property-card";
import { ChevronLeft, ChevronRight, Building2, Loader2 } from "lucide-react";

export function PropertyGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const location = searchParams.get("location") || undefined;
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = 6;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["properties", location, minPrice, maxPrice, categoryId, page],
    queryFn: () =>
      fetchProperties({
        location,
        minPrice,
        maxPrice,
        categoryId,
        page,
        limit,
      }),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
          >
            <div className="aspect-[16/10] w-full bg-slate-800" />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 rounded bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-800/60" />
              <div className="h-10 w-full rounded bg-slate-800/40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <p className="text-sm font-medium text-red-400">
          Failed to load properties.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { properties, meta } = data;

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 py-16 text-center">
        <Building2 className="h-12 w-12 text-slate-600" />
        <h3 className="mt-4 text-lg font-semibold text-slate-300">
          No matching properties found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Try broadening your location, category, or price range filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Property Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination Controls */}
      {meta.totalPage > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-400">
            Showing Page <span className="font-semibold text-white">{meta.page}</span> of{" "}
            <span className="font-semibold text-white">{meta.totalPage}</span> ({meta.total} properties)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPage}
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
