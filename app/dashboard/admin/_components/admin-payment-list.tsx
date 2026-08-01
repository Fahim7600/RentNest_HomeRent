"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminPayments } from "../actions";
import { CreditCard, Calendar, DollarSign, ChevronLeft, ChevronRight, User } from "lucide-react";
import type { PaymentStatus } from "@/lib/types";

export function AdminPaymentList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-payments", page],
    queryFn: () => fetchAdminPayments({ page, limit: 10 }),
  });

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            COMPLETED
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            PENDING
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

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <CreditCard className="h-5 w-5 text-indigo-400" />
          Platform Payment Transactions
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Read-only audit trail of all transactions processed across the platform.
        </p>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40"
              />
            ))}
          </div>
        ) : isError || !data ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-xs text-red-400">Failed to load platform payment history.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        ) : data.payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 py-10 text-center">
            <DollarSign className="h-8 w-8 text-slate-600" />
            <h3 className="mt-2 text-sm font-semibold text-slate-300">
              No payment transactions recorded yet
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/40 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Tenant</th>
                  <th className="px-4 py-3 font-medium">Landlord</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Transaction ID */}
                    <td className="px-4 py-4 font-mono text-xs text-indigo-300 max-w-[200px] truncate" title={pay.transactionId || pay.id}>
                      {pay.transactionId || pay.id}
                    </td>

                    {/* Tenant */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>{pay.tenant?.name || `Tenant ID: ${pay.tenantId.slice(0, 8)}...`}</span>
                      </div>
                    </td>

                    {/* Landlord */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <User className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span>{pay.landlord?.name || `Landlord ID: ${pay.landlordId.slice(0, 8)}...`}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 font-semibold text-white">
                      ${pay.amount?.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">{getPaymentStatusBadge(pay.status)}</td>

                    {/* Date */}
                    <td className="px-4 py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {pay.createdAt
                            ? new Date(pay.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
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
