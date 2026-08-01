import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/app/_components/navbar";

export const metadata: Metadata = {
  title: "Payment Cancelled — RentNest",
  description: "Your payment process was cancelled. You can try again anytime from your dashboard.",
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="mx-auto max-w-md px-4 w-full text-center">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <XCircle className="h-10 w-10" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Payment Cancelled
              </h1>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                You have cancelled the Stripe payment process. No charges were made to your account.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/dashboard/tenant"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500"
              >
                <LayoutDashboard className="h-4 w-4" />
                Return to Tenant Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
