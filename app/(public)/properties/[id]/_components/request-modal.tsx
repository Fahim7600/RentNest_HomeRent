"use client";

import { useState } from "react";
import { X, Calendar, Clock, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/lib/types";

export function RequestToRentModal({
  property,
  isOpen,
  onClose,
}: {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [moveInDate, setMoveInDate] = useState("");
  const [duration, setDuration] = useState("6");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Rental request created! (Submission wired in next prompt)");
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Request to Rent</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Price preview */}
          <div className="flex items-center justify-between rounded-xl bg-slate-800/50 p-3 text-xs">
            <span className="text-slate-400">Monthly Rent</span>
            <span className="text-sm font-bold text-indigo-400">
              ${property.rentAmount?.toLocaleString()} / mo
            </span>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Desired Move-in Date
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="date"
                required
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rental Duration */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Rental Duration (Months)
            </label>
            <div className="relative">
              <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
              >
                <option value="1" className="bg-slate-900">1 Month</option>
                <option value="3" className="bg-slate-900">3 Months</option>
                <option value="6" className="bg-slate-900">6 Months</option>
                <option value="12" className="bg-slate-900">12 Months (1 Year)</option>
                <option value="24" className="bg-slate-900">24 Months (2 Years)</option>
              </select>
            </div>
          </div>

          {/* Message to Landlord */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Message to Landlord (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <textarea
                rows={3}
                placeholder="Introduce yourself or mention specific requests..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Submitting..." : "Submit Rental Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
