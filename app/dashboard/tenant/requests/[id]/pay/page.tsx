"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Navbar } from "@/app/_components/navbar";
import {
  fetchRentalRequestById,
  createPaymentSession,
} from "@/app/dashboard/tenant/actions";
import { ApiError } from "@/lib/api-client";
import type { RentalRequest } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentInitiationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [rentalRequest, setRentalRequest] = useState<RentalRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchRentalRequestById(id)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setErrorMsg("Rental request not found.");
        } else {
          setRentalRequest(data);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          setErrorMsg(err.message);
        } else {
          setErrorMsg("Failed to load rental request details.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleProceedToPayment = async () => {
    if (!rentalRequest) return;

    setIsSubmitting(true);
    try {
      const res = await createPaymentSession(rentalRequest.id);
      if (res && res.url) {
        toast.loading("Redirecting to secure Stripe checkout...");
        window.location.href = res.url;
      } else {
        toast.error("Payment session URL was not returned. Please try again.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Failed to create payment session.");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred while initiating payment.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const property = rentalRequest?.property;
  const rentPrice = property?.rentAmount ?? property?.price ?? 0;
  const duration = rentalRequest?.duration ?? 1;
  const totalAmount = rentPrice * duration;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/dashboard/tenant"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tenant Dashboard
          </Link>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4 animate-pulse">
              <div className="h-6 w-48 bg-slate-800 mx-auto rounded" />
              <div className="h-4 w-64 bg-slate-800/60 mx-auto rounded" />
              <div className="h-40 bg-slate-800/40 rounded-xl" />
            </div>
          ) : errorMsg || !rentalRequest ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <h2 className="text-lg font-bold text-white">Error Loading Request</h2>
              <p className="mt-2 text-xs text-red-400">{errorMsg || "Unable to find request details."}</p>
              <Link
                href="/dashboard/tenant"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                  <CreditCard className="h-3.5 w-3.5" />
                  Checkout Summary
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                  Initiate Payment
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Review your rental agreement summary and proceed to Stripe checkout.
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md space-y-6">
                {/* Property Details Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      Property
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      {property?.title || "Rental Property"}
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      {property?.location || "Location N/A"}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
                    {rentalRequest.status}
                  </span>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-800/40 p-4 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      Move-in Date
                    </span>
                    <p className="font-semibold text-white text-sm">
                      {rentalRequest.moveInDate
                        ? new Date(rentalRequest.moveInDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-slate-800/40 p-4 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      Lease Duration
                    </span>
                    <p className="font-semibold text-white text-sm">
                      {duration} {duration === 1 ? "Month" : "Months"}
                    </p>
                  </div>

                  {property?.landlord?.name && (
                    <div className="rounded-xl border border-slate-800/80 bg-slate-800/40 p-4 space-y-1 sm:col-span-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        Landlord
                      </span>
                      <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                        {property.landlord.name}
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      </p>
                    </div>
                  )}
                </div>

                {/* Total Price Calculation */}
                <div className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/60 p-5 border border-indigo-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Total Payment Due</span>
                    <div className="text-xs text-slate-400">
                      ${rentPrice.toLocaleString()} × {duration} mo
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-white">
                      ${totalAmount.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400">Processed via Stripe</span>
                  </div>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Generating Stripe Session..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
