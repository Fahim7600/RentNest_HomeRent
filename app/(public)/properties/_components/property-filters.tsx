"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, MapPin, DollarSign, Filter, RotateCcw, Tag } from "lucide-react";
import { fetchCategories } from "../actions";
import type { Category } from "@/lib/types";

export function PropertyFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [categories, setCategories] = useState<Category[]>([]);
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res));
  }, []);

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Always reset page to 1 when changing filters
    params.delete("page");

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-white">
          <Filter className="h-4 w-4 text-indigo-400" />
          Filter Properties
        </h2>
        {(location || minPrice || maxPrice || categoryId) && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {/* Location Search */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Location
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="e.g. Dhaka, Gulshan"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                updateFilters({ location: e.target.value });
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Category
          </label>
          <div className="relative">
            <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                updateFilters({ categoryId: e.target.value });
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Monthly Rent ($)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateFilters({ minPrice: e.target.value });
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-7 pr-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateFilters({ maxPrice: e.target.value });
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-7 pr-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
