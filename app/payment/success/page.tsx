"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  LayoutDashboard,
} from "lucide-react";
import { Navbar } from "@/app/_components/navbar";
import { fetchTenantPayments } from "@/app/dashboard/tenant/actions";
import type { Payment } from "@/lib/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [isLoading, setIsLoading] = useState(true);
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null);

  const checkPaymentStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetchTenantPayments({ limit: 10 });
      const completed = res.payments.find(
        (p) =>
          p.status === "COMPLETED" ||
          (sessionId && (p.transactionId === sessionId || p.id === sessionId))
      );
      if (completed) {
        setCompletedPayment(completed);
      } else if (res.payments.length > 0) {
        // Fallback to most recent completed if available
        const latest = res.payments.find((p) => p.status === "COMPLETED");
        if (latest) setCompletedPayment(latest);
      }
    } catch (err) {
      console.error("Error checking payment status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-slate-800" />
            <div className="h-6 w-48 bg-slate-800 mx-auto rounded" />
            <div className="h-4 w-64 bg-slate-800/60 mx-auto rounded" />
          </div>
        ) : completedPayment ? (
          /* Success State */
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Payment Confirmed!
              </h1>
              <p className="mt-2 text-xs text-slate-400">
                Your rental payment has been processed successfully. Your rental lease is now active.
              </p>
            </div>

            {/* Payment Summary */}
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50 space-y-2 text-xs text-left">
              <div className="flex flex-col gap-1 border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono text-indigo-300 text-xs break-all">
                  {completedPayment.transactionId || completedPayment.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-bold text-white">
                  ${completedPayment.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-emerald-400">COMPLETED</span>
              </div>
            </div>

            <Link
              href="/dashboard/tenant"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500"
            >
              <LayoutDashboard className="h-4 w-4" />
              Return to Tenant Dashboard
            </Link>
          </div>
        ) : (
          /* Confirmation Pending State */
          <div className="space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="h-10 w-10 animate-spin" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Confirming Your Payment...
              </h1>
              <p className="mt-2 text-xs text-slate-400">
                Stripe webhooks are confirming your transaction. This may take a few moments to reflect in your account.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={checkPaymentStatus}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh Payment Status
              </button>

              <Link
                href="/dashboard/tenant"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Tenant Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="text-center text-slate-400 text-sm">
              Loading payment confirmation...
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
