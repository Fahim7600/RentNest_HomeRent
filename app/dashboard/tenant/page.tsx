import type { Metadata } from "next";
import { Navbar } from "@/app/_components/navbar";
import { RequestList } from "./_components/request-list";
import { PaymentList } from "./_components/payment-list";
import { UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Tenant Dashboard — RentNest",
  description: "Manage your rental requests, view status updates, and track payment history.",
};

export default function TenantDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                <UserCheck className="h-3.5 w-3.5" />
                Tenant Portal
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                Tenant Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your rental applications, payments, and property reviews in one place.
              </p>
            </div>
          </div>

          {/* Section 1: Rental Requests History */}
          <RequestList />

          {/* Section 2: Payment History */}
          <PaymentList />
        </div>
      </main>
    </div>
  );
}
