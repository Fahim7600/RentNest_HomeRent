"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLandlordRequests, processRequest } from "../actions";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import type { RentalRequest, RentalRequestStatus } from "@/lib/types";

export function LandlordRequestList() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const queryKey = ["landlord-requests", statusFilter, page];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchLandlordRequests({ status: statusFilter, page, limit: 10 }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "APPROVE" | "REJECT" }) =>
      processRequest(id, action),
    onMutate: async ({ id, action }) => {
      setProcessingId(id);
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<{
        rentals: RentalRequest[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      }>(queryKey);

      if (previousData) {
        const targetStatus: RentalRequestStatus =
          action === "APPROVE" ? "APPROVED" : "REJECTED";

        queryClient.setQueryData(queryKey, {
          ...previousData,
          rentals: previousData.rentals.map((r) =>
            r.id === id ? { ...r, status: targetStatus } : r
          ),
        });
      }

      return { previousData };
    },
    onSuccess: (responseData, variables) => {
      const verb = variables.action === "APPROVE" ? "approved" : "rejected";
      toast.success(`Rental request successfully ${verb}!`);
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      if (err instanceof ApiError) {
        toast.error(err.message || "Failed to process request");
      } else {
        toast.error("Failed to process request");
      }
    },
    onSettled: () => {
      setProcessingId(null);
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
    },
  });

  const getStatusBadge = (status: RentalRequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            PENDING
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
            APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400">
            REJECTED
          </span>
        );
      case "ACTIVE":
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            ACTIVE
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
            {status}
          </span>
        );
    }
  };

  const tabs: { label: string; value?: string }[] = [
    { label: "All Requests", value: undefined },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Active", value: "ACTIVE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <FileText className="h-5 w-5 text-indigo-400" />
            Incoming Rental Applications
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Review applicant details and approve or reject rental requests.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 rounded-xl bg-slate-800/60 p-1 border border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40"
              />
            ))}
          </div>
        ) : isError || !data ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-xs text-red-400">Failed to load rental requests.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        ) : data.rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-12 text-center">
            <Building2 className="h-10 w-10 text-slate-600" />
            <h3 className="mt-3 text-sm font-semibold text-slate-300">
              No rental applications found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {statusFilter
                ? `No ${statusFilter.toLowerCase()} applications right now.`
                : "Incoming requests from tenants will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/40 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Tenant</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Move-in Date</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.rentals.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Tenant Info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">
                            {req.tenant?.name || "Applicant Tenant"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {req.tenant?.email || req.tenant?.phone || "Tenant info"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="px-4 py-4">
                      <div>
                        <Link
                          href={`/properties/${req.propertyId}`}
                          className="font-semibold text-white hover:text-indigo-400 line-clamp-1 transition-colors text-xs"
                        >
                          {req.property?.title || `Property ID: ${req.propertyId.slice(0, 8)}...`}
                        </Link>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {req.property?.location}
                        </p>
                      </div>
                    </td>

                    {/* Move-in Date */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {req.moveInDate
                            ? new Date(req.moveInDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>{req.duration} {req.duration === 1 ? "Month" : "Months"}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">{getStatusBadge(req.status)}</td>

                    {/* Action buttons */}
                    <td className="px-4 py-4 text-right">
                      {req.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              mutation.mutate({ id: req.id, action: "APPROVE" })
                            }
                            disabled={processingId === req.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-all disabled:opacity-50"
                          >
                            {processingId === req.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              mutation.mutate({ id: req.id, action: "REJECT" })
                            }
                            disabled={processingId === req.id}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                          >
                            {processingId === req.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.meta.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
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
    </div>
  );
}
